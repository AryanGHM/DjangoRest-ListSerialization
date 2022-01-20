# BookShelf Example
## Django-Rest Framework ListSerialization utilization.
### Disclaimer
This project is in very early stages, it is to be refactored and prettified as well as dockerized in the coming days ;).

## How to use
**Prerequisits:**
- Python 3.< installed
- Node.js and npm installed

**Steps:**
1. Clone the repository, `git clone https://github.com/AryanGHM/DjangoRest-ListSerialization`
2. `cd DjangoRest-ListSerialization`
3. (Skip if you already have virtualenv installed) `pip install virtualenv`
4. `virtualenv venv`
5. Activate virtual env:
  - (Windows PS) .\venv\Scripts\activate
  - (Linux) source /venv/bin/activate
6. Install python requirements: `pip install -r requirements.txt`
7. `cd restuser`
8. `python manage.py runserver` Now api is Running!
9. Now with the react app `cd frontend/src`
10. `npm install`
11. `npm start`
12. Now you can access react app at `http://localhost:3000/` and the API endpoint at `http://localhost:8000/books`
