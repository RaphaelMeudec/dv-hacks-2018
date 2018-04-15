from .src import potholedet as potdet

def main(im_path, path_score=None):
    det = potdet.PotholeDetection(img_path)
    score = det.get_score()
    if path_score is None:
        return det.get_score()
    else:
        det.dump_score(path):
