# Third-party licences (self-hosted runtime libraries)

Everything under `/lib/` is third-party open-source code that we serve from our own domain (no CDN at runtime).
All licences allow commercial use and redistribution provided the notices below are kept.
Keep this file deployed next to the libraries and update it whenever `scripts/3d/vendor-model-viewer.mjs` is re-run.

| File | Project | Version | Licence | Notes |
|---|---|---|---|---|
| `lib/model-viewer/model-viewer.min.js` | [`@google/model-viewer`](https://github.com/google/model-viewer) | 4.3.1 | Apache-2.0 | Full text: `lib/model-viewer/LICENSE-model-viewer.txt`. Unmodified dist bundle. |
| ↳ bundled inside | [three.js](https://github.com/mrdoob/three.js) | r183 | MIT | Includes three's `meshopt_decoder.module.js`, `GLTFLoader`, `USDZExporter`. |
| ↳ bundled inside | [Lit](https://github.com/lit/lit) (`lit`, `lit-html`, `lit-element`, `@lit/reactive-element`) | 3.x | BSD-3-Clause | |
| ↳ bundled inside | [`@monogrid/gainmap-js`](https://github.com/MONOGRID/gainmap-js) | 3.x | MIT | |
| ↳ bundled inside | [fflate](https://github.com/101arrowz/fflate) | 0.8.x | MIT | Used by the on-the-fly USDZ exporter. |
| `lib/model-viewer/meshopt_decoder.js` | [meshoptimizer](https://github.com/zeux/meshoptimizer) | 1.3.0 | MIT | Classic-script wrapper of `meshopt_decoder.mjs` (only the `export` line replaced by `self.MeshoptDecoder = …`). Full text: `lib/model-viewer/LICENSE-meshoptimizer.md`. |

Build-time only (not shipped to browsers, listed for completeness): `@gltf-transform/*` (MIT), `meshoptimizer` encoder (MIT), `sharp` (Apache-2.0) with libvips (LGPL-3.0, used as an unmodified dynamic library), `gltf-validator` (Apache-2.0).

The 3D models, textures and images under `/models/` are our own work and are **not** covered by any of these licences.

---

## Apache License 2.0 — @google/model-viewer

Copyright 2018–2026 Google LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at <http://www.apache.org/licenses/LICENSE-2.0>. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

The complete licence text ships as `lib/model-viewer/LICENSE-model-viewer.txt`. The package has no NOTICE file.

## MIT License — three.js

Copyright © 2010-2026 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## MIT License — meshoptimizer

Copyright (c) 2016-2026 Arseny Kapoulkine

Same MIT terms as above. Full text: `lib/model-viewer/LICENSE-meshoptimizer.md`.

## MIT License — @monogrid/gainmap-js

Copyright (c) 2023 MONOGRID

Same MIT terms as above.

## MIT License — fflate

Copyright (c) 2023 Arjun Barrett

Same MIT terms as above.

## BSD 3-Clause License — Lit

Copyright (c) 2017 Google LLC. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
