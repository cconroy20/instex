# Interferometer mode: image skies

Compiled 2026-10-20. Each value comes from a document saved unmodified under `rawdata/interf/images/` (not in git), with
its location and a short verbatim quote; **DERIVED** marks arithmetic done here. The quotes are checked against the
saved pages' tag-stripped text (see the check at the end).

## M101, the Hubble mosaic (web/img/m101_hubble.jpg)

| key | document | local file | URL |
|---|---|---|---|
| EH | ESA/Hubble, image heic0602a, "Hubble's largest galaxy portrait offers a new high-definition view" (image page: credit, coordinates, field of view, orientation, pixel size, formats). Fetched 2026-10-20 | `rawdata/interf/images/esahubble_heic0602a.html` | https://esahubble.org/images/heic0602a/ |
| EC | ESA/Hubble, "Usage of images, videos and web texts" (the license). Fetched 2026-10-20 | `rawdata/interf/images/esahubble_copyright.html` | https://esahubble.org/copyright/ |
| EL | ESA/Hubble heic0602a, "Large JPEG" (the full-resolution image, 15852 x 12392 px, 92,550,524 bytes) | `rawdata/interf/images/heic0602a_large.jpg` | https://cdn.esahubble.org/archives/images/large/heic0602a.jpg |

| item | value | source | quote |
|---|---|---|---|
| credit | Image: European Space Agency & NASA | EH, caption | "Image: European Space Agency & NASA" |
| acknowledgements | Project Investigators for the original Hubble data: K.D. Kuntz (GSFC), F. Bresolin (University of Hawaii), J. Trauger (JPL), J. Mould (NOAO), and Y.-H. Chu (University of Illinois, Urbana); Image processing: Davide De Martin (ESA/Hubble); CFHT image: Canada-France-Hawaii Telescope/J.-C. Cuillandre/Coelum; NOAO image: George Jacoby, Bruce Bohannan, Mark Hanna/NOAO/AURA/NSF | EH, caption | "Project Investigators for the original Hubble data: K.D. Kuntz (GSFC), F. Bresolin (University of Hawaii), J. Trauger (JPL), J. Mould (NOAO), and Y.-H. Chu (University of Illinois, Urbana)" |
| credit is mandatory | the full credit line, visibly | EH, formats | "Crediting this image with the full credit line, in a visible way is MANDATORY, if you want to use it without paying a fee." |
| license | Creative Commons Attribution 4.0 International | EC, Summary | "ESA/Hubble images, videos and web texts are released under the Creative Commons Attribution 4.0 International license and may on a non-exclusive basis be reproduced without fee provided they are clearly and visibly credited." |
| credit display | clear, readable, unaltered, with the image | EC, Conditions | "The full image or footage credit must be presented in a clear and readable manner to all users, with the wording unaltered" |
| size | 15852 x 12392 px | EH | "Size: 15852 x 12392 px" |
| field of view | 13.20 x 10.32 arcmin | EH, Coordinates | "Field of view: 13.20 x 10.32 arcminutes" |
| orientation | north 3.5 deg right of vertical | EH, Coordinates | "Orientation: North is 3.5° right of vertical" |
| position | RA 14 3 34.71, Dec 54 18 3.65 | EH, Coordinates | "Position (RA): 14 3 34.71" |

**DERIVED**: pixel = 13.20 arcmin x 60 / 15852 px = 0.04996 arcsec (the full-resolution image); the page's copy is
resized to 8000 px across (0.0990 arcsec per pixel, 792 / 8000), then turned 3.5 deg counterclockwise to put north up,
which widens the frame to 8368 x 6732 px; width on the sky = 8368 x 0.0990 = 828.43 arcsec. East is taken to the left
(the release states only north). Processing (ImageMagick 7.1.2): `magick heic0602a_large.jpg -colorspace Gray -resize
8000x -background black -rotate -3.5 -strip -quality 90 -sampling-factor 1x1 m101_hubble.jpg` (13,331,965 bytes). The
gray value is used as the sky's brightness: the picture's own stretch, not a calibrated brightness. Why 8000 px and not
the full 15852: the page reads the image into memory (four bytes a pixel while reading), which at full resolution is
about 800 MB, more than a browser reliably gives a page.

## Also downloaded, not used

THINGS H I maps of M101 (NGC 5457; natural and robust weighting, moment 0) from https://www2.mpia-hd.mpg.de/THINGS/Data.html
(`rawdata/interf/images/NGC_5457_{NA,RO}_MOM0_THINGS.FITS`, 2048 x 2048 at 1 arcsec): built as a second image sky, then
dropped on Charlie's call (10-20: "use an optical M101 image", as high resolution as possible). The THINGS pages give
their text as images, so no usage terms could be quoted.
