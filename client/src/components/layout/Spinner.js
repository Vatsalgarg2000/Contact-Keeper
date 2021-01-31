/* while we load data from the github application, something needs to show up on the screen, it cannot be left blank
so in that Time, a spinner gif will be displayed for our site to look Better
This component does this job */

import React, { Fragment } from 'react';
import spinner from './spinner.gif';

//loads a spinner gif in the time Api fetches the data
export const Spinner = () => {
  return (
    <Fragment>
      <img
        src={spinner}
        alt='Loading....'
        style={{ width: '200px', margin: 'auto', display: 'block' }}
      />
    </Fragment>
  );
};

export default Spinner;
