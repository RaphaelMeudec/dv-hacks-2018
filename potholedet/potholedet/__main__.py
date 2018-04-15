from .src import potholedet as potdet

def main(dir_path, path_score=None):
    """main function to score list of images.

    Parameters
    ----------
    dir_path : str
        path to image directory.
    path_score : str
        if None then no dump.

    Returns
    -------
    pd.DataFrame
        if not path_score then return pandas DataFrame of scores otherwise ump csv file.

    """
    det = potdet.PotholeDetection(dir_path)
    score = det.get_score()
    if path_score is None:
        return det.get_score()
    else:
        det.dump_score(path_score):

if __name__ == "__main__":
    dir_path = '../../data'
    main(dir_path, path_score='../../data/images_score.csv')
