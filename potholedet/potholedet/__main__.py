from .src import potholedet as potdet

def main(dir_path, path_score=None):
    det = potdet.PotholeDetection(dir_path)
    score = det.get_score()
    if path_score is None:
        return det.get_score()
    else:
        det.dump_score(path_score):

if __name__ == "__main__":
