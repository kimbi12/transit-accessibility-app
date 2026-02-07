import re
from typing import Any, Dict, Optional, Tuple

from services.maps_service import geocode, route_osrm  # <-- matches your maps_service.py name

def _norm(s: str) -> str:
    return re.sub(r"\s+", " ", s.strip())

def _extract_two_places(text: str) -> Optional[Tuple[str, str]]:
    t = _norm(text.lower())

    m = re.search(r"\bfrom\s+(.+?)\s+\bto\s+(.+)$", t)
    if m:
        return (_norm(m.group(1)), _norm(m.group(2)))

    m = re.search(r"^(.+?)\s+\bto\s+(.+)$", t)
    if m and len(m.group(1)) >= 2 and len(m.group(2)) >= 2:
        return (_norm(m.group(1)), _norm(m.group(2)))

    return None

def _wants_route(text: str) -> bool:
    t = text.lower()
    keywords = ["route", "directions", "how do i get", "get to", "go to", "from", " to "]
    return any(k in t for k in keywords)

def _fmt_distance_m(meters: float) -> str:
    if meters >= 1000:
        return f"{meters/1000:.1f} km"
    return f"{int(round(meters))} m"

def _fmt_duration_s(seconds: float) -> str:
    mins = int(round(seconds / 60))
    if mins <= 1:
        return "about 1 minute"
    return f"about {mins} minutes"

class AssistantService:
    async def handle(self, text: str) -> Dict[str, Any]:
        text_clean = _norm(text)

        if _wants_route(text_clean):
            places = _extract_two_places(text_clean)
            if not places:
                return {
                    "intent": "clarify_route",
                    "response": "Tell me two places like: 'from Union Station to Toronto City Hall'.",
                    "data": {}
                }

            origin_q, dest_q = places

            origin_hits = await geocode(origin_q, limit=1)
            dest_hits = await geocode(dest_q, limit=1)

            if not origin_hits:
                return {"intent": "route", "response": f"I couldn't find '{origin_q}'. Try adding the city.", "data": {}}
            if not dest_hits:
                return {"intent": "route", "response": f"I couldn't find '{dest_q}'. Try adding the city.", "data": {}}

            o = origin_hits[0]
            d = dest_hits[0]

            o_lat, o_lon = float(o["lat"]), float(o["lon"])
            d_lat, d_lon = float(d["lat"]), float(d["lon"])

            route = await route_osrm(o_lat, o_lon, d_lat, d_lon, profile="foot")
            if route.get("code") != "Ok" or not route.get("routes"):
                return {"intent": "route", "response": "I couldn’t generate a route between those points.", "data": {}}

            r0 = route["routes"][0]
            dist = float(r0.get("distance", 0.0))
            dur = float(r0.get("duration", 0.0))

            response = (
                f"{o.get('display_name','Origin')} → {d.get('display_name','Destination')} "
                f"is {_fmt_distance_m(dist)} and {_fmt_duration_s(dur)} walking."
            )

            return {
                "intent": "route",
                "response": response,
                "data": {
                    "origin": {"name": o.get("display_name"), "lat": o_lat, "lon": o_lon},
                    "destination": {"name": d.get("display_name"), "lat": d_lat, "lon": d_lon},
                    "distance_m": dist,
                    "duration_s": dur,
                    "geometry": r0.get("geometry"),
                }
            }

        return {
            "intent": "unknown",
            "response": "I can help with routes. Try: 'from Union Station to Toronto City Hall'.",
            "data": {}
        }
