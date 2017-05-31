# afx

## Setup

Install the package dependencies: `npm install`.

Copy the pre-commit Git hook, to ensure the assets are compiled before you commit.
```
cp pre-commit .git/hooks/.
```

## Development

```
grunt development
```


## Scrambler

Scrambler is a stand alone static page, scrambling through a set of user generated passwords

### Setup

Login to Firebase

```
  PATH=$(npm bin):$PATH firebase login
```

### Development

```
PATH=$(npm bin):$PATH firebase serve
```
