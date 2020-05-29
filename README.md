![pulsebox](./public/images/PULSEBOX-V1.svg)

## 💭 Background

pulsebox is the data collector and storage solution for managing data between [pulsetracker](https://github.com/akilhylton/pulsetracker).

## Who is this app for?

This app allows developers to easily record and upload heart rate
data. It's a touch-based system where users will place one of their fingers on the back camera while the flash is present. The user will record a 10-second video that can then be uploaded to pulsebox for later processing by [pulsetracker](https://github.com/akilhylton/pulsetracker).

## Why Touch Based?

Touch-based systems are generally more accurate and efficient compared to Touch-less systems. A touch-based system requires physical input such as a finger on a camera however, a touch-less system usually uses the front camera without physical input.

## Run locally

This project uses Firebase for OAuth and Storage.

```
$ curl -sL https://firebase.tools | bash
```

After install the Firebase CLI cloning this repository
and changing directories to it.

```
$ firebase serve
```

## Licensing

This repository and all contributions herein are licensed under the MIT license. Please note that, by contributing to this repository, whether via commit, pull request, issue, comment, or in any other fashion, you are explicitly agreeing that all of your contributions will fall under the same permissive license.
