const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('data.js', 'utf8');
const context = { window: {} };
vm.runInNewContext(source, context, { filename: 'data.js' });
const data = context.window.MAP_DATA;
const errors = [];

function required(value, name) { if (value === undefined || value === null) errors.push(`Brak wymaganej struktury: ${name}`); return value; }
function coord(value, name, order = 'latlon') {
  if (!Array.isArray(value) || value.length !== 2 || value.some(n => typeof n !== 'number' || !Number.isFinite(n))) { errors.push(`${name}: oczekiwano pary liczb`); return; }
  const lat = order === 'latlon' ? value[0] : value[1], lon = order === 'latlon' ? value[1] : value[0];
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) errors.push(`${name}: współrzędne poza zakresem (${value})`);
}
function segments(value, name, order = 'lonlat') {
  if (!Array.isArray(value) || value.length === 0) { errors.push(`${name}: brak segmentów`); return; }
  value.forEach((segment, i) => {
    if (!Array.isArray(segment) || segment.length < 2) errors.push(`${name}[${i}]: segment musi zawierać co najmniej 2 punkty`);
    else segment.forEach((point, j) => coord(point, `${name}[${i}][${j}]`, order));
  });
}
function points(value, name, order = 'latlon') {
  if (!Array.isArray(value) || value.length < 2) { errors.push(`${name}: oczekiwano co najmniej 2 punktów`); return; }
  value.forEach((point, i) => coord(point, `${name}[${i}]`, order));
}
function stations(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || !Object.keys(value).length) { errors.push(`${name}: brak stacji`); return; }
  const names = Object.keys(value), normalized = names.map(n => n.trim().toLocaleLowerCase('pl-PL'));
  if (normalized.some(n => !n)) errors.push(`${name}: pusta nazwa stacji`);
  if (new Set(normalized).size !== normalized.length) errors.push(`${name}: zduplikowana nazwa stacji`);
  names.forEach(n => coord(value[n], `${name}.${n}`));
}
function stationList(value, name) {
  if (!Array.isArray(value) || !value.length) { errors.push(`${name}: brak stacji`); return; }
  const names = value.map(s => String(s.name || '').trim().toLocaleLowerCase('pl-PL'));
  if (names.some(n => !n)) errors.push(`${name}: pusta nazwa stacji`);
  if (new Set(names).size !== names.length) errors.push(`${name}: zduplikowana nazwa stacji`);
  value.forEach((s, i) => coord([s.lat, s.lon], `${name}[${i}]`));
}

required(data, 'MAP_DATA');
if (data) {
  ['m1', 'm2_existing', 'm2_new', 'm3', 'm2_ursus', 'skm', 'tram'].forEach(key => required(data[key], key));
  segments(data.m1?.segments, 'm1.segments');
  segments(data.m2_existing?.segments, 'm2_existing.segments');
  points(data.m2_new?.extension, 'm2_new.extension', 'latlon');
  points(data.m3?.coords, 'm3.coords', 'latlon');
  points(data.m2_ursus?.coords, 'm2_ursus.coords', 'latlon');
  stations(data.stations_existing, 'stations_existing');
  stations(data.m2_new?.stations, 'm2_new.stations');
  stations(data.m3?.stations, 'm3.stations');
  stations(data.m2_ursus?.stations, 'm2_ursus.stations');
  stationList(data.skm, 'skm.stations');
  if (!Array.isArray(data.tram) || !data.tram.length) errors.push('tram: brak linii tramwajowych');
  else data.tram.forEach((line, i) => {
    if (!Array.isArray(line) || !line[0]) errors.push(`tram[${i}]: brak numeru linii`);
    const routeGroups = line?.[1];
    if (!Array.isArray(routeGroups) || !routeGroups.length) errors.push(`tram[${i}]: brak przebiegu`);
    else routeGroups.forEach((route, j) => points(route, `tram[${i}].route[${j}]`, 'lonlat'));
  });
}
if (errors.length) { console.error(`Walidacja data.js nie powiodła się (${errors.length} błędów):`); errors.forEach(e => console.error(`- ${e}`)); process.exitCode = 1; }
else console.log('Walidacja data.js zakończona powodzeniem.');
