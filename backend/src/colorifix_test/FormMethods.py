import json
from src.colorifix_test.DataImporter import DataImporter


class FormMethods:
    """
    The methods required to handle forms for the Colorifix Coding Test
    """

    def __init__(self):
        """
        Constructor for FormMethods: reading data JSON
        """
        data_importer = DataImporter()
        try:
            self.json_input_data = data_importer.read_data()
        except Exception as e:
            print('Error ' + str(e))

    def apply_method(self, method, params):
        """
        Sends the parameters to the given method
        """
        # Defaults for response data
        # method = method
        data = ''
        status = 'error'  # defensive coding
        status_message = 'Message missing'

        # Check method is available in FormMethods
        for available_method in self.get_available_methods():
            if method == available_method:
                # print('Found method:' + method)
                try:
                    # Try to call the method
                    func = getattr(self, method)
                    data = func(params)
                    status = 'success'
                    status_message = 'Success'

                except Exception as e:
                    # Uh-oh something went wrong - report what was
                    status = 'error'
                    status_message = 'Error ' + \
                        str(e) + ' in method ' + str(method)

                break  # no need to loop further
            else:
                status_message = 'Method not found'

        response = {
            "method": method,
            "data": data,
            "status": status,
            "status_message": status_message,
        }
        return response

    def get_available_methods(self):
        """
        The list of functions the client can call. Should be automatically
        generated via something like:

        `inspect.getmembers(FormMethods, predicate=inspect.isfunctions)`
        or
        `inspect.getmembers(FormMethods, predicate=inspect.ismethods)`

        but I couldn't get that working reliably on time. Of course, we
        could just let the try block fail in `apply_method` and dispense
        with the for loop and conditional, but this seems safer, and nicer
        for the user.
        """
        return [
            'get_form_names',
            'get_form_specs',
            'submit_form'
        ]

    # 'public' methods that actually get called from the client

    def get_form_names(self, params):
        """
        get_form_names() => form_names:list
        The `params` parameter is ignored and should be `{}`.
        """
        forms = self.json_input_data['forms']
        data_to_return = []
        for form in forms:
            # print('form: ', form)
            data_to_return.append(
                {
                    "name": form["name"],
                    "label": form["label"],
                    "description": form["description"]
                }
            )
        return json.dumps(data_to_return)

    def get_form_specs(self, params):
        """
        get_form_specs(name:str) => form_spec:json
        The `params` parameter should be `{form_name: <form_name>}`
        """
        form_name = params["form_name"]
        # print('Looking for:', form_name)
        # print('\n')
        try:
            forms = self.json_input_data['forms']
            form_definition = {}
            for form in forms:
                # print('  trying: ', form)
                if form["name"] == form_name:
                    form_definition = {
                        "name": form["name"],
                        "parameters": form["parameters"],
                    }
                    break
            return form_definition
        except Exception as e:
            # Uh-oh something went wrong - report what was
            return 'Error ' + \
                str(e) + ' in get_form_specs'

    def submit_form(self, params):
        """
        submit_from(name: str, data: json) => None
        The `params` parameter should be `{form_data: <Dict>}`
        """
        form_data = params["form_data"]
        print(params)
        print(form_data)

        # Here is where you'd put the data in some form of storage

        return None
