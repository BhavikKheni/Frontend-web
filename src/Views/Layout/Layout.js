import React from "react";
import OweraHeader from "../Header/Header";
import Container from '@material-ui/core/Container';

function DefaultLayout(props) {
  return (
    <div>
      <OweraHeader />
      <div className={'content_wrapper'}>
        <div className={'content_data'}>
          <Container fixed>
            {props.children}
          </Container>
        </div>
        <footer className={'main_footer'}>
          
        </footer>
      </div>
    </div>
  );
}
export default DefaultLayout;
