# Bored Games - An E-commerce website done as a project in COMP3900
Made by: Kath-Lin Han, Hannah Charak, Darwin Chow, Alex Kim
See demo here: https://bored-games-3900.web.app/
## Running for the first time in Windows

#### Setting up a virtual environment in Windows
1. `cd` into /backend
2. `py --version` to check python version is 3.7 or higher
3. `py -m venv {name of package}` e.g. `py -m venv .venv` to create virtual environment
4. `source .venv/Scripts/activate` to activate virtual environment

#### Accessing the project in Windows 
1. `cd` into /backend to access backend directory
2. `pip install -r requirements.txt` (this installs all of the necessary packages from `requirements.txt`)
3. `cd` into /src
4. `python routes.py` to run the project

## Running for the first time in Linux

#### Setting up a virtual environment in Linux
1. `cd` into /backend to access backend directory
2. `python3 -m venv {name of your package}` e.g. `python3 -m venv .venv` to create virtual environment
3. `source .venv/bin/activate` to activate the virtual environment

#### Accessing the project in Linux / Vlab
1. `python3 -V` check that the version is 3.7 or higher, update python if not
2. `pip install --upgrade setuptools`
3. `python3 -m pip install -U pip`  
4. `pip3 install -r requirements.txt` (this installs all of the necessary packages from `requirements.txt`)
5. `cd` into /src
6. `python3 routes.py` to run the project

## Setting up the frontend
0. install node.js?
1. `cd` into /frontend
2. `npm install` (this installs the `node_modules` from `package.json`)
3. `npm start` to run the project

## To run the already set up project for the backend:
1. `cd` into /backend
2. `source .venv/Scripts/activate` for Linux OR `source .venv/bin/activate` for Windows to activate the virtual enviornment
3. `pip3 install -r requirements.txt` (installs any new packages) for Linux or `pip install -r requirements.txt` for Windows
4. `python routes.py`
