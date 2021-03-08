# Simon Garrett's Colorifix Test README

1. The **Getting Started** section is first since you probably want to now how to use the code before you do much else.

2. The rest of the files explains how I set up the project environment to write the code, and how I solved issues.

3. There are some ponderings and notes that you may find helpful to understand why I did/didn't do certain things.

## Getting Started

#### Starting the Backend

To start the backend server:

`cd backend && python3 server.py`.

To run the tests:

`cd backend && pytest tests/test_backend.py` (all pass).

#### Starting the Frontend

1. Install everything with:

`cd frontend` > `npm install` (The Vue CLI installer used NPM, so I'm sticking with it.)

2a. Compiling and hot-reloading for development:

`yarn serve` - this will start on port 3088, which is important so I know where to point Cypress to run the end-to-end
tests.

2b. Compiling and minification for production:

`yarn build` (not that you'll need to)

3. Running the tests:

To run the **end-to-end** (Cypress) tests, FIRST, start the backend, then the frontend, _then_ run Cypress!

`cd /frontend && yarn cypress open` (if you'd like to see Cypress' interactive UI)

`cd /frontend && yarn cypress run` (if you just want to run the tests, CLI-styleee)

you can run the backend, **unit tests** via, `cd /backend && pytest`.

> NOTE: it's assumed the front and backend will be on the same machine, and they are setup to communicate via
> `localhost`. If you'd prefer the backend to be on one machine, and the frontend on another (both on the same LAN,
> presumably), you can adjust the backend server settings in `/backend/server.py` (line 18), and the frontend server
> settings in `/frontend/src/Home.vue` (line 217).

## Backend / Python Setup

I needed to play with things a bit on my Mac to get Python 3.7 working properly, since I haven't done any Python for a
while. I got `pdoc` and `pytest` working too.

If I'd had time, I'd have got Poetry working because it's _really_ nice, but in the end it was faster to use PIP and to
run things directly via `python3`.

Here's what I did:

- I installed Python 3.9 via Mac Package installer from here: https://www.python.org/downloads/release/python-392/. This
  may have been a mistake as things Didn't Work (tm) after that.
- I attempted (a lot) to set up Poetry package manager using
  `curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -` .
- Ran `poetry new backend` to create a standard Python project structure: no code would run and I couldn't load
  packages.
- I altered one of Poetry's files so it looked for Python3 rather than Python2. Still didn't work. I couldn't get
  `curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python3 -` (python3) to work,
  which I think may have been the key fix.

... decided to go back to PIP and `python3`...

- I upgraded PIP to 21.0.1: `/usr/local/bin/python3 -m pip install --upgrade pip`.
- I installed PEP8: `/usr/local/bin/python3 -m pip install pep8 // install pep8`.
- I installed autopep8 `/usr/local/bin/python3 -m pip install --upgrade autopep8` to allow for nice linting in VS Code.
- I also installed Flake8 via `/usr/local/bin/python3 -m pip` because autopep8 seemed to miss some things. Not really
  sure if that was necessary, but wanted to be safe - though I use ESLint and Prettier all the time, Python linters
  weren't really a thing when I last used Python properly.
- Installed the 'Python' extension into VS Code.
- I setup 'Python' extension to use autopep8.
- Added Simple Websocket Client to Chrome for initial manual web socket testing.
- I manually corrected an apparent typo (or was it a cunning test?!) in the `data.json` file: 'rerquired' => 'required'.

## Frontend / Vue Setup

How did I set up the Frontend?

- Ran `vue create frontend` and choose a bunch of settings, including ESLint, Prettier, some useful Vue-specific stuff,
  etc.
- **NOTE:** Frontend uses standard Prettier settings, which are obviously a lot different to PEP8 for backend (2 spaces
  rather than 4, different new-line spacing rules, for example).

## Documentation

- Frontend inline docs - I've already got JSDoc set up for Javascript.
- Backend inline docs - I installed pdoc(3) for Python via: `/usr/local/bin/python3 -m pip install pdoc`.
- User docs - The **Getting Started** section below is probably all that's needed for a project of this size.

## Testing

#### pytest

- I installed it with: `/usr/local/bin/python3 -m pip install pytest`.
- I created a `tests` directory via `pdoc` inside the `backend` and wrote unit tests there.

#### Cypress

I included Cypress when I did `vue create frontend` above. The tests are in `/frontend/tests/e2e/specs`.

Thereafter, Cypress just works via the UI that Cypress provide, see Getting Started for more information on how to run
the tests. See [Cypress](https://www.cypress.io/) for more information on how Cypress works.

## Ponderings and Notes

- See the TODO file for a checklist of all features in the project spec. I think they're all covered. In any case, I'm
  out of time(!), having taken just over 7hrs to do this (I think you suggested 5hrs was what I should spend?)

- As you'll probably have seen, I had issues getting Poetry up and running. I think it was getting confused with the
  three versions of Python I have on my machine (2.7, 3.7 and 3.9). I could have got it working, but this coding test
  wasn't about that so I focussed on getting to the goal instead.

- For this test, I haven't worried too much about browser compatibility beyond Chrome because I know you all use Macs
  (as I do). This means you can't use IE11, and therefore pretty much all IE11 gotchas are irrelevant. There are one or
  two Safari issues these days, but a full suite of Cypress tests could be set up to find them.

- I've done validation on front and back end. I could also do JS validation, such as
  [Vee-Validate](https://vee-validate.logaretm.com/v4/) which I've used on a few sites, not least of which on my old
  company's site [BERTRAM+BEAN](https://bertramandbean.com) &mdash; if you scroll to the bottom, and play with one of
  the forms, you see it adds red/green borders and gives bespoke error messages.

- And finally, thank you for the opportunity to do this fun, interesting test for you.
