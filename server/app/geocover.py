from fastapi import APIRouter, HTTPException, Query
import httpx

router = APIRouter()

GEOCOVER_API_URL = "https://api3.geo.admin.ch/rest/services/api/MapServer/ch.swisstopo.geologie-geocover/query"


@router.get("/geocover")
async def get_geocover_data(
    bbox: str = Query(
        ..., description="Bounding box in the format xmin,ymin,xmax,ymax (EPSG:2056)"
    )
):
    """
    Holt Geocover-Daten von der RESTful API basierend auf der Bounding Box.
    """
    params = {
        "geometry": bbox,
        "geometryType": "esriGeometryEnvelope",
        "inSR": "2056",
        "spatialRel": "esriSpatialRelIntersects",
        "outFields": "*",
        "returnGeometry": "true",
        "f": "geojson",
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(GEOCOVER_API_URL, params=params)
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail="Fehler beim Abrufen der Geocover-Daten",
            )
        return response.json()


# export router
__all__ = ["router"]
