from src import __version__
from src.colorifix_test.DataImporter import DataImporter
from src.colorifix_test.FormMethods import FormMethods

# Test startup


def test_version():
    assert __version__ == '0.1.0'

# Test DataImporter


def test_read_json_file_no_exist():
    di = DataImporter()
    assert not di.read_json_file('no_file')


def test_read_json_file_exist():
    di = DataImporter()
    assert di.read_json_file('data.json')


# Test FormMethods

def test_apply_method():
    fm = FormMethods()
    method = 'get_form_specs'
    params = {
        "form_name": "request_colour"
    }
    assert len(fm.apply_method(method, params)) > 0


def test_get_available_methods():
    fm = FormMethods()
    assert len(fm.get_available_methods()) == 3


def test_get_form_names():
    fm = FormMethods()
    params = {}
    assert len(fm.get_form_names(params)) > 0


def test_get_form_specs():
    fm = FormMethods()
    params = {
        "form_name": "request_colour"
    }
    assert fm.get_form_specs(params)["name"] == "request_colour"


def test_submit_form():
    fm = FormMethods()
    params = {
        "form_data": {
            "colour": "Golden Yellow",
            "fabric": "Wool",
            "duration": "87"
        }
    }
    assert fm.submit_form(params) is None
