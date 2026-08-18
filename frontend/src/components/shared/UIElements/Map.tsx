import { useRef, useEffect } from "react";
import type { MapProps } from "../../../types/ui";
import styles from "./Map.module.css";
import "ol/ol.css";
import OlMap from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import { fromLonLat } from "ol/proj.js";
import View from "ol/View.js";

const Map = (props: MapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const { center, zoom } = props;

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const map = new OlMap({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([center.lng, center.lat]),
        zoom: zoom,
      }),
    });

    return () => {
      map.setTarget(undefined);
    };
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`${styles.map} ${props.className || ""}`}
      style={props.style}
      tabIndex={0}
    ></div>
  );
};

export default Map;
