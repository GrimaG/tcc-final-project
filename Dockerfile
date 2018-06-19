FROM python:3
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
CMD ["python","-u","main.py"]
WORKDIR /code
ADD requirements.txt /code/
RUN pip3 install -vvv -r requirements.txt
ADD . /code/