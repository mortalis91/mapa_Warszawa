# Mapa komunikacji Warszawy

Interaktywna mapa Warszawy dla osób analizujących lokalizację mieszkań względem komunikacji publicznej. Po wpisaniu adresu aplikacja pokazuje jego położenie, najbliższą stację metra oraz orientacyjny czas dojścia pieszo.

Na mapie znajdują się:

- istniejące linie metra M1 i M2 oraz stacje;
- wybrane linie SKM i tramwajowe;
- schematyczna trasa PKP: Łomża → Śniadowo → Ostrołęka → Wyszków → Tłuszcz → Warszawa Wschodnia → Warszawa Centralna;
- planowane przedłużenie M2 do stacji Lazurowa, Chrzanów i Karolin;
- koncepcyjna linia M3 w kierunku Gocławia;
- koncepcyjne przedłużenie M2 w kierunku Ursusa;
- strefy i punkty istotne z perspektywy analizy nieruchomości;
- pierścienie orientacyjnego czasu dojścia od centrum Warszawy.

> Aplikacja ma charakter poglądowy. Nie jest narzędziem do podejmowania decyzji inwestycyjnych. Przebiegi i terminy inwestycji należy weryfikować w aktualnych, oficjalnych źródłach.

## Uruchomienie lokalne

Projekt nie wymaga instalowania Node.js ani budowania aplikacji. Ponieważ przeglądarka może ograniczać działanie `fetch()` przy otwieraniu pliku bezpośrednio z dysku, uruchom prosty serwer HTTP w katalogu projektu.

### Python

```powershell
python -m http.server 8000
```

Otwórz następnie <http://localhost:8000>.

Jeśli polecenie `python` nie jest dostępne, możesz użyć:

```powershell
py -m http.server 8000
```

Zatrzymanie serwera: `Ctrl+C` w oknie terminala.

## Struktura plików

| Plik | Rola |
|---|---|
| `index.html` | Interfejs, style, konfiguracja Leaflet, wyszukiwanie adresu i renderowanie warstw |
| `data.js` | Dane tras, stacji, linii SKM, tramwajów, stref i punktów biznesowych |
| `README.md` | Dokumentacja projektu |

## Jak korzystać

1. Wpisz adres, najlepiej z dopiskiem `Warszawa`, np. `ul. Lazurowa 12, Warszawa`.
2. Kliknij **Pokaż** lub zatwierdź formularz klawiszem Enter.
3. Sprawdź marker adresu, najbliższą stację i orientacyjny czas dojścia.
4. Włączaj i wyłączaj warstwy z panelu w prawym górnym rogu.
5. Kliknij stację, odcinek trasy albo strefę, aby zobaczyć szczegóły.

## Dane i zależności

- [Leaflet](https://leafletjs.com/) 1.9.4 — interaktywna mapa;
- [OpenStreetMap](https://www.openstreetmap.org/) / Nominatim — geokodowanie adresu;
- [Carto](https://carto.com/basemaps/) — podkład mapowy;
- dane tras i stacji zapisane lokalnie w `data.js`.
- granice dzielnic pobierane jako GeoJSON z publicznej usługi ArcGIS.

Wyszukiwanie adresu wymaga dostępu do internetu. Publiczny Nominatim ma limity użycia i wymaga kulturalnego korzystania; przy większym ruchu należy zastosować własny backend lub inną usługę geokodowania. Dane w `data.js` zawierają również przybliżone przebiegi planowanych tras — należy oznaczać je jako koncepcyjne i regularnie aktualizować.

Warstwa **Dzielnice Warszawy** jest domyślnie dostępna w kontrolce warstw. Po jej włączeniu można najechać na obszar, aby zobaczyć nazwę dzielnicy, albo kliknąć go, aby otworzyć szczegóły. Granice są pobierane z warstwy GeoJSON usługi ArcGIS; do działania wymagają połączenia z internetem.

Warstwa **PKP · Łomża → Warszawa** pokazuje schematyczne połączenie przez Śniadowo, Ostrołękę, Wyszków, Tłuszcz, Ząbki i Warszawę Zacisze-Wilno, dalej do Warszawy Wschodniej i Centralnej. Nie jest to dokładna geometria torów ani rozkład jazdy; punkty służą do orientacyjnej analizy położenia.

## Proponowane usprawnienia

### Najwyższy priorytet

- liczyć rzeczywistą trasę pieszą po chodnikach zamiast szacunku na podstawie odległości w linii prostej;
- pokazywać odległość i czas do najbliższej stacji każdego środka transportu, nie tylko metra;
- rozdzielić jednoznacznie warstwy „istnieje”, „w budowie”, „planowane” i „koncepcyjne”;
- dodać datę aktualizacji danych oraz link do źródła przy każdej inwestycji;
- poprawić obsługę błędów geokodowania, limitów API i niejednoznacznych adresów.

### Funkcje przydatne przy wyborze mieszkania

- porównywanie kilku adresów jednocześnie;
- filtr maksymalnego czasu dojścia, np. 5, 10, 15 i 20 minut;
- wyszukiwanie nieruchomości w zadanym promieniu od wybranej stacji;
- ranking lokalizacji według dostępu do metra, SKM, tramwaju i centrum;
- wyświetlanie przesiadek oraz orientacyjnego czasu dojazdu do wskazanego celu;
- eksport widoku i wyników do PNG/PDF lub udostępnialnego linku.

### Jakość i utrzymanie

- przenieść dane z dużego skryptu inline do osobnych modułów JavaScript;
- walidować `data.js` skryptem sprawdzającym współrzędne, nazwy stacji i kompletność linii;
- dodać testy obliczeń odległości oraz test przeglądarkowy wyszukiwania adresu;
- zoptymalizować dane tras i ładować cięższe warstwy dopiero po ich włączeniu;
- dodać tryb mobilny z wysuwanym panelem filtrów i przyciskiem „użyj mojej lokalizacji”;
- rozważyć PWA i cache danych, aby mapa działała częściowo offline.

## Licencje i atrybucja

Mapa wyświetla wymaganą, widoczną atrybucję: [© OpenStreetMap contributors](https://www.openstreetmap.org/copyright), [© CARTO](https://carto.com/attribution/). Atrybucja jest ustawiona w kontrolce Leaflet i musi pozostać widoczna także na eksportach mapy.

Przed publicznym wdrożeniem należy zaakceptować aktualne [warunki CARTO Basemaps](https://www.carto.com/legal/basemap-terms/). Klucz CARTO jest używany po stronie przeglądarki, dlatego należy ograniczyć go w panelu CARTO do domen wdrożeniowych i monitorować limity; po ujawnieniu klucza poza zespołem należy go wygenerować ponownie. Nominatim jest używany wyłącznie do ręcznego wyszukiwania adresu, z odstępem co najmniej 1 sekundy między żądaniami. Publiczna usługa nie może być używana do autouzupełniania, masowych zapytań ani przy większym ruchu; wtedy należy użyć własnej instancji lub dostawcy komercyjnego. Obowiązuje [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/).

### GitHub Pages

Klucz nie jest przechowywany w repozytorium. W ustawieniach repozytorium dodaj sekret `CARTO_BASEMAPS_API_KEY`, a następnie włącz GitHub Pages jako źródło **GitHub Actions**. Workflow `.github/workflows/deploy-pages.yml` wstawi klucz wyłącznie do artefaktu wdrożeniowego. W panelu CARTO ogranicz klucz do adresu `login.github.io` lub własnej domeny.

Dane OpenStreetMap są udostępniane na licencji [ODbL](https://opendatacommons.org/licenses/odbl/1-0/). Przy dystrybucji danych pochodnych należy zachować informacje licencyjne i spełnić wymagania share-alike; dane użyte w aplikacji powinny być odróżnione od własnych danych koncepcyjnych.

## Walidacja danych

Po zmianie tras lub stacji uruchom w katalogu projektu:

```powershell
node validate-data.js
```

Skrypt sprawdza wymagane linie, segmenty tras, zakresy współrzędnych oraz nazwy i współrzędne stacji. Kod zakończenia `0` oznacza poprawne dane, a `1` wykryte błędy.
