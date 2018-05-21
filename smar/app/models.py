from django.db import models
import matplotlib
matplotlib.use('Agg')
from skimage import data, exposure, img_as_float
from skimage.filters.rank import median
from skimage.morphology import disk
from skimage.filters import threshold_otsu, rank
import matplotlib.pyplot as plt
from skimage import img_as_ubyte
from skimage import morphology
from io import BytesIO
import base64
from PIL import Image



import numpy as np

class Transaction():
    channel= ''
    noise= False
    otsu = False
    morphology =[]
    img_old = ''
    img_new = '' 
    def __init__(self, channel, noise, otsu, morphology, img_old, img_new, *args, **kwargs):
        self.channel = channel
        self.noise = noise
        self.otsu = otsu
        self.morphology = morphology
        self.img_old = img_old
        self.img_new = img_new

class ImageProcess():
    #retorna o histograma da imagem, sendo possivel isolar a cor ou nao
    def isolate( self, image, chanel = 'none'):
        if(chanel == 'B'):
            image = image[ :, :, 2]
        if (chanel == 'G'):
            image = image[:, :, 1]
        if (chanel == 'R'):
            image = image[:, :, 0]
        return image

    #Este metodo serve para remocao de ruidos da imagem
    #image = imagem a ser processada ; value_of_disk = ??
    def noiseRemove(self, image, value_of_disk = 1):
        noisy_image = img_as_ubyte(image)
        return median(noisy_image, disk(value_of_disk))

    def binaryImage(self, img):
        treshold = threshold_otsu(img)  ## para binarizar a img de acordo com a limiar
        return img >= treshold  ## dada a limiar ele converte pra binario
        

    def convertImageTo64(self, img_a):
        buffer = BytesIO()
        img_a.save(buffer, format="JPEG")
        img_str = base64.b64encode(buffer.getvalue())
        return img_str

    def convertBinaryArrayToImage(self, binary_img):
        im =np.array(binary_img * 255, dtype = np.uint8)
        img = Image.fromarray(im)
        return img
    
    def convertArrayToImage(self, img_array):
        return  Image.fromarray(img_array)

    def morfologia(self, image, morfologia, value=1):
        if(morfologia =='Closing'):
            return morphology.closing(image, disk(value))
        elif (morfologia == 'Opening'):
            return morphology.opening(image, disk(value))
        elif (morfologia =='Erosion'):
            return morphology.erosion(image, disk(value))
        elif (morfologia == 'Dilation'):
            return morphology.dilation(image, disk(value))

    def count( self, image_old, image_new):
            old = np.array(image_old)
            new = np.array(image_new)
            px_old = np.sum(old > 0)
            px_new = np.sum(new > 0)
            return ((px_new/px_old)-1)

'''
    def showImages(self, images, titles, qtdImages):
        fig, axes = plt.subplots(ncols=qtdImages, sharex=True, sharey=True,
                               figsize=(8, 4))

        if (qtdImages>1):
            ax = axes.ravel()
            index = 0
            for image in images:
                ax[index].imshow(image, cmap=plt.cm.gray)
                ax[index].set_title(titles[index])
                index+=1

            for a in ax:
                a.axis('off')
        else:
            axes.imshow(images[0], cmap=plt.cm.gray)
            axes.set_title(titles[0])
            axes.axis('off')


        plt.tight_layout()
        plt.show()
'''


# Create your models here.
