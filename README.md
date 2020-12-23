# Socket notes

Write on your kindle, using your computer as the input device.

## Getting started

### Installing

#### Requires

1. node
2. git
3. yarn

```bash
$ git clone git@github.com:rdjpalmer/socket-notes
$ cd socket-notes
$ yarn
```

### Running

```bash
$ yarn start
```

Then follow the instructions on screen.

## Y tho?

I do a lot of writing just before bed, but really hate looking at bright
back lit displays. Sleep and writing therefore aren't particularly compatible.

The devices on the market have subpar writing experiences, or are expensive
and have limited function beyond writing.

E-ink monitors aren't yet wide spread, so aren't accessible to the masses.

A lot of people have a kindle, or another e-reader lying around. Let's repurpose
it.

## How tho?

Newer Kindles have an experimental browser. It's limited in what it can do
(Amazon have intentionally limited its capabilities with CSS and JavaScript).

Luckily with SockJS's wide-spread compatibility, the Kindle supports a form of
WebSockets.

We use the Kindle as a display device with rudamentary inputs, such as Save.
Otherwise, all the work is done on your main computer, which acts as the input
device and storage.
