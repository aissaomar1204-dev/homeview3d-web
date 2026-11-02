import cv2,numpy as np,glob,os
fs=sorted(glob.glob('salida/muestras/t*.png'))
ims=[cv2.resize(cv2.imread(f),(270,480)) for f in fs]
for i,f in zip(ims,fs): cv2.putText(i,os.path.basename(f)[1:-4],(6,22),cv2.FONT_HERSHEY_SIMPLEX,.6,(0,0,255),2)
rows=[np.hstack(ims[i:i+6]+[np.zeros_like(ims[0])]*(6-len(ims[i:i+6]))) for i in range(0,len(ims),6)]
cv2.imwrite('salida/muestras/_hoja.jpg',np.vstack(rows),[cv2.IMWRITE_JPEG_QUALITY,85])
print(len(fs))
