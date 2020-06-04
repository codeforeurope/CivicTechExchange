// @flow
import React from 'react';
import type {FluxReduceStore} from 'flux/utils';
import {Container} from 'flux/utils';
import ProjectSearchStore, {LocationRadius}  from "../../../stores/ProjectSearchStore.js";
import ProjectSearchDispatcher from "../../../stores/ProjectSearchDispatcher.js";
import LocationAutocomplete from "../../../common/location/LocationAutocomplete.jsx";
import type {LocationInfo} from "../../../common/location/LocationInfo";
import Selector from "../../../common/selection/Selector.jsx";
import {CountrySelector} from "../../../common/selection/CountrySelector.jsx";
import {CountryCodeFormats, CountryData, DefaultCountry} from "../../../constants/Countries.js";
import GlyphStyles from '../../../utils/glyphs.js'


type State = {|
  countryCode: string,
  location: LocationRadius,
  locationInfo: LocationInfo,
  searchRadius: number,
  locationExpanded: boolean
|};

//define CSS classes as consts for toggling, same as RenderFilterCategory.jsx
const classCategoryExpanded = 'ProjectFilterContainer-category ProjectFilterContainer-expanded';
const classCategoryCollapsed = 'ProjectFilterContainer-category ProjectFilterContainer-collapsed';
const classSubcategoryExpanded = 'ProjectFilterContainer-subcategory ProjectFilterContainer-expanded';
const classSubcategoryCollapsed = 'ProjectFilterContainer-subcategory ProjectFilterContainer-collapsed';

class LocationSearchSection extends React.Component<{||}, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      searchRadius: 10,
      countryCode: DefaultCountry.ISO_3,
      locationExpanded: false
    };

    this.updateLocationState = this.updateLocationState.bind(this);
  }

  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }

  static calculateState(prevState: State): State {
    return {
      location: ProjectSearchStore.getLocation() || {}
    };
  }

  //handle expand/collapse
  _handleExpand(event) {
    this.setState(prevState => ({
      locationExpanded: !prevState.locationExpanded
    }));
  }

  updateLocationState(): void {
    if(this.state.locationInfo && this.state.searchRadius) {
      const locationRadius: LocationRadius = {
        latitude: this.state.locationInfo.latitude,
        longitude: this.state.locationInfo.longitude,
        radius: this.state.searchRadius
      };
      ProjectSearchDispatcher.dispatch({
        type: 'SET_LOCATION',
        location: locationRadius,
      });
    }
  }

  onCountrySelect(country: CountryData): void {
    if(this.state.countryCode !== country.ISO_3) {
      this.setState({countryCode: country.ISO_3});
    }
  }

  onLocationSelect(locationInfo: LocationInfo): void {
    if(!this.state.locationInfo || !locationInfo || this.state.locationInfo !== locationInfo.location_id ) {
      this.setState({locationInfo: locationInfo}, this.updateLocationState);
    }
  }

  onRadiusSelect(searchRadius: number): void {
    if(!this.state.searchRadius || this.state.searchRadius !== searchRadius ) {
      this.setState({searchRadius: searchRadius}, this.updateLocationState);
    }
  }

  _renderSelector(): React$Node {
    return (
      <React.Fragment>

        <label>Country(Required)</label>
        <CountrySelector
          countryCode={this.state.countryCode}
          countryCodeFormat={CountryCodeFormats.ISO_3}
          onSelection={this.onCountrySelect.bind(this)}
        />

        <label>Near</label>
        <LocationAutocomplete
          countryCode={this.state.countryCode}
          onSelect={this.onLocationSelect.bind(this)}
        />

        <label>Distance</label>
        <Selector
          id="radius"
          isSearchable={false}
          isClearable={false}
          isMultiSelect={false}
          options={[5,10,25,50,100,200]}
          labelGenerator={(num) => num + " Miles"}
          selected={this.state.searchRadius}
          onSelection={this.onRadiusSelect.bind(this)}
        />
      </React.Fragment>
    );
  }

  render() {
    return (
        <div className="LocationSearchContainer">
          <div className={this.state.locationExpanded ? classCategoryExpanded : classCategoryCollapsed}>
            <div className='ProjectFilterContainer-category-header' id="location-search-section" onClick={(e) => this._handleExpand(e)}>
              <span>Location</span>
              <span className="ProjectFilterContainer-showtext">{this.state.locationExpanded ? <i className={GlyphStyles.ChevronUp}></i> : <i className={GlyphStyles.ChevronDown}></i>}</span>
            </div>
            <div className="ProjectFilterContainer-content LocationSearchContainer-content">
              {this._renderSelector()}
            </div>
          </div>
        </div>
    );
  }

}

export default Container.create(LocationSearchSection);