# 3D asset credits

## Animated tactical operators

The 3D prototype loads these rigged GLB soldier characters from Gobkit's free character pack:

- Assault Team Leader
- Black Ops Operator
- Frontline Rifleman
- Night Recon Scout
- Ghillie Sniper

Source: https://gobkit.com/api/free
Pack page: https://gobkit.itch.io/gobkit-free-character-pack-vol-4

The pack page identifies the characters as rigged GLB models with Idle, Walk, Run, Death, Hit, Attack and Special animation clips and states that the pack is licensed CC0 1.0 for commercial use without attribution. The model URLs are loaded from Gobkit's CDN at runtime; the models are not bundled in this repository.

## Important implementation notes

- The procedural soldier meshes remain as a fallback if a remote model cannot load.
- Models are cloned with Three.js SkeletonUtils so their skeletal animation rigs remain independent.
- Idle and movement animations are played through Three.js AnimationMixer.
- Runtime loading requires an internet connection and the model host to permit browser cross-origin requests.
- The current buildings, terrain, and weapon meshes are still prototype geometry; this file does not claim they are finished realistic assets.
