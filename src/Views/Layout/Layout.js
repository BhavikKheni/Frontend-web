import React from "react";
import OweraHeader from "../Header/Header";
import Container from '@material-ui/core/Container';

function DefaultLayout(props) {
  return (
    <div>
      <OweraHeader />
      <div className={'content-wrapper'}>
        <div className={'content-data'}>
          <Container fixed>
            {props.children}
          </Container>
        </div>
        <footer className={'main-footer'}>
          
        </footer>
      </div>
    </div>
  );
}
export default DefaultLayout;
