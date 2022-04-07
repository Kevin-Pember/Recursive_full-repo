import shutil
import os

webSRC = r"./localWeb"
andDirec = r"./AndroidSRC/app/src/main/assets/localWeb"

shutil.copytree(webSRC, andDirec)
