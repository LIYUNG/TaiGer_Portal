import React from 'react';
import { Card, Carousel } from 'react-bootstrap';

function GuestMainView() {
  return (
    <>
      <Card className="mt-0">
        <Card.Header as="h5">
          <Card.Title>Welcome to Taiger!</Card.Title>
        </Card.Header>
        <Card.Body>
          I hope you will enjoy the journey in the following months.
        </Card.Body>
      </Card>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://www.tum.de/fileadmin/_processed_/f/7/csm_1436302_39af3c4190.jpg"
            alt="First slide"
            width="500"
            height="500"
          />
          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://www.br.de/fernsehen/ard-alpha/sendungen/campus/uni-heidelberg-100~_v-img__16__9__xl_-d31c35f8186ebeb80b0cd843a7c267a0e0c81647.png?version=b84fb"
            alt="First slide"
            width="500"
            height="500"
          />
          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://assets.deutschlandfunk.de/FILE_3c2658a7439a6b00973d66dd14b950ac/1920x1080.jpg?t=1597521991999"
            alt="Second slide"
            width="500"
            height="500"
          />

          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://www.uni-mannheim.de/media/_processed_/8/f/csm_BK1A0427-01_bearb_aec4f90d2e.jpg"
            alt="Third slide"
            width="500"
            height="500"
          />

          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://www.rwth-aachen.de/global/show_picture.asp?id=aaaaaaaaabcnksg&w=1080&q=719&q=73"
            alt="Third slide"
            width="500"
            height="500"
          />

          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://www.stuttgarter-zeitung.de/media.media.711add0c-5063-4aae-be67-cc8c91a31983.original1024.jpg"
            alt="Third slide"
            width="500"
            height="500"
          />

          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </>
  );
}

export default GuestMainView;
