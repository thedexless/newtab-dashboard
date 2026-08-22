import React from "react";
import { useToggle } from "../../../hooks";
import { Icon } from "../../../views/shared";
import { geocodeLocation, requestLocation } from "./api";
import "./LocationInput.sass";
import { parseLatitude, parseLongitude } from "./coordinates";
import { draftFromProp } from "./draftSync";
import { Coordinates } from "./types";

type Props = {
  latitude?: number;
  longitude?: number;
  onChange: (location: Coordinates & { name?: string }) => void;
};

const isValidLatitude = (lat?: number) =>
  lat != null && Number.isFinite(lat) && lat >= -90 && lat <= 90;

const isValidLongitude = (long?: number) =>
  long != null && Number.isFinite(long) && long >= -180 && long <= 180;

const isValidCoordinates = (lat?: number, long?: number) =>
  isValidLatitude(lat) && isValidLongitude(long);

const GeocodeInput: React.FC<Props> = ({ onChange }) => {
  const [query, setQuery] = React.useState("");

  const handleGeocode = (event: React.FormEvent) => {
    event.preventDefault();
    geocodeLocation(query)
      .then((coords) => onChange({ ...coords, name: query }))
      .catch(() => {
        alert("Unable to find location. Please try again.");
      });
  };

  return (
    <form onSubmit={handleGeocode}>
      <div className="grid" style={{ gridTemplateColumns: "1fr auto" }}>
        <label htmlFor="LocationInput__query">Search for city</label>

        <div />

        <input
          id="LocationInput__query"
          placeholder="City or location"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <button type="submit" className="button--primary button--icon">
          <Icon name="search" />
        </button>
      </div>
    </form>
  );
};

const geolocationAvailable = "geolocation" in navigator;

const CoordinateInput: React.FC<Props> = ({
  latitude,
  longitude,
  onChange,
}) => {
  const [latStr, setLatStr] = React.useState(latitude?.toString() ?? "");
  const [longStr, setLongStr] = React.useState(longitude?.toString() ?? "");

  // Sync local drafts only for genuine external coordinate updates
  // (e.g. geolocation). Intermediate edits that parse to the same value as
  // the prop (like "1." while the prop is 1, or "-" which parses to
  // undefined) are preserved, not overwritten.
  React.useEffect(() => {
    const next = draftFromProp(latitude, isValidLatitude, latStr, parseLatitude);
    if (next !== null) setLatStr(next);
  }, [latitude]);
  React.useEffect(() => {
    const next = draftFromProp(longitude, isValidLongitude, longStr, parseLongitude);
    if (next !== null) setLongStr(next);
  }, [longitude]);

  const handleLocate = () => {
    requestLocation()
      .then(onChange)
      .catch((err) => alert(`Cannot determine your location: ${err.message}`));
  };

  return (
    <div className="LocationInput">
      <div
        className="grid"
        style={{
          gridTemplateColumns: geolocationAvailable
            ? "1fr 1fr auto"
            : "1fr 1fr",
        }}
      >
        <label htmlFor="LocationInput__latitude">Latitude</label>

        <label htmlFor="LocationInput__longitude">Longitude</label>

        {geolocationAvailable && <div />}

        <input
          id="LocationInput__latitude"
          type="text"
          value={latStr}
          onChange={(event) => {
            setLatStr(event.target.value);
            onChange({ latitude: parseLatitude(event.target.value) });
          }}
        />

        <input
          id="LocationInput__longitude"
          type="text"
          value={longStr}
          onChange={(event) => {
            setLongStr(event.target.value);
            onChange({ longitude: parseLongitude(event.target.value) });
          }}
        />

        {geolocationAvailable && (
          <button
            className="button--primary button--icon"
            onClick={handleLocate}
          >
            <Icon name="navigation" />
          </button>
        )}
      </div>
    </div>
  );
};

const LocationInput: React.FC<Props> = ({ onChange, ...props }) => {
  const hasCoordinates = isValidCoordinates(props.latitude, props.longitude);
  const [lookUp, toggleLookUp] = useToggle(!hasCoordinates);

  const handleChange = (coords: Coordinates) => {
    onChange(coords);
    if (lookUp) toggleLookUp();
  };

  return (
    <div className="LocationInput">
      {lookUp ? (
        <GeocodeInput {...props} onChange={handleChange} />
      ) : (
        <CoordinateInput {...props} onChange={handleChange} />
      )}

      <a onClick={toggleLookUp}>
        {lookUp ? "Enter coordinates" : "Search for city"}
      </a>
    </div>
  );
};

export default LocationInput;
