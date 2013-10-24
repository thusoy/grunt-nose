def activate_virtualenv(activate_this_path):
    """ execfile was removed in python 3.X, so we need an alternative solution in that case."""
    try:
        # python 2.X
        execfile(activate_this_path, dict(__file__=activate_this_path))
    except:
        # Python 3.X
        exec(open(activate_this_path), dict(__file__=activate_this_path))
