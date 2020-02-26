// @flow

import React from 'react';
import Button from 'react-bootstrap/Button';
import _ from 'lodash';
import Section from "../../enums/Section.js";
import url from "../../utils/url.js";
import cdn from "../../utils/cdn.js";

type Props = {|
  header: string,
  text: ?$ReadOnlyArray<string>,
  bottomOverlayText: ?$ReadOnlyArray<string>,
  img: ?string,
  className: ?string,
  onClickFindProjects: () => void
|};

export const HeroImage: { [key: string]: string } = {
  TopLanding: "CodeForGood_072719_MSReactor-064.jpg",
  MidLanding: "CodeForGood_072719_MSReactor-034.jpg",
  BottomLanding: "CodeForGood_072719_MSReactor-003.jpg",
};

const heroImages: $ReadOnlyArray<string> = [
  HeroImage.TopLanding,
  "CodeForGood_072719_MSReactor-074.jpg",
  "CodeForGood_072719_MSReactor-020.jpg"
];

class SplashScreen extends React.PureComponent<Props> {
  _heroRandomizer(): void {
    let imgIndex = Math.floor(Math.random() * Math.floor(heroImages.length));
    return cdn.image(heroImages[imgIndex])
  }

  render(): React$Node {
    const backgroundUrl: string = this.props.img ? cdn.image(this.props.img) : this._heroRandomizer();
    const cssClass = "SplashScreen-root SplashScreen-opacity-layer SplashScreen-opacity50 " + this.props.className
    return (
      <div className={cssClass} style={{backgroundImage: 'url(' + backgroundUrl + ')' }}>
        <div className="SplashScreen-content">
          {this.props.header ? <h1>{this.props.header}</h1> : null}
          <div className="SplashScreen-section">
            {this.props.text ? <p>{this.props.text}</p> : null}
            {this.props.children}
          </div>
        </div>
        <div className="photo-credit"><a href="https://www.nowheremanphotos.com/">Photograph by Mike Wilson</a></div>
        {!_.isEmpty(this.props.bottomOverlayText) && this._renderBottomOverlay()}
      </div>
    );
  }

  _renderBottomOverlay(): React$Node {
    return (
      <div className="SplashScreen-mission SplashScreen-opacity-layer SplashScreen-opacity20">
        {this.props.bottomOverlayText.map((text) => (<p>{text}</p>))}
      </div>
    );
  }

}
export default SplashScreen;
