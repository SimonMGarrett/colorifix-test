import json
import os.path


class DataImporter:
    """
    A rather contrived class, but here to enforce 'separation of concerns'
    """

    def read_json_file(self, fname):
        dir = os.path.dirname(__file__)
        filename = os.path.join(dir, '..', fname)

        if not os.path.isfile(filename):
            return False

        with open(filename) as json_file:
            data = json.load(json_file)  # or 'loads'
            for p in data:
                # print('-- ', str(p))
                self.data = data
                # print('-- DATA JSON', type(data), data)
                # print('\n')
            return data

    def read_data(self):
        return self.read_json_file('data.json')
