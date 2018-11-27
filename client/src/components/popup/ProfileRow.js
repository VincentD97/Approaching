import React, { Component } from 'react';
import '../../css/Profile.css';
import Icon from './Icon';

/**
 * @classdesc Called by Popup to construct a pair of one Icon and one text value. 
 * 
 */
class ProfileRow extends Component {
    /**
	 * Currently we manually construct datas for popup to display since we do not have communication with others.
     * Initialize the state variables with corresponding input data.
     * (TO BE DONE) Communication with other front-end components and server.
	 * @constructor
	 * @param {None}
	 * @return {void} 
	 */
    constructor(props) {
        super(props);

        this.state = {
            item: this.props.details
        };
    }

    /**
	 * This method set the value of this row's item to the new input value.
	 * 
	 * @param {JsonObject} event a specific event that invokes this method, e.g. editing the iput form
	 * @return {void} 
	 */
    handleChange(event){
        this.setState({
            item: event.target.value
        });
        this.props.handleEditResult(this.props.field,event.target.value);
    }

    /**
	 * Render the row based on the given input. 
     *
     *  @param {String} field The data type of given text value, e.g. location, time.
     * @param {String} iconName The name of FAIcon to be constructed.
     * @param {Boolean} editing Whether the Popup is in editing mode.
     * @param {JsonObject} handleEditResult Pass handleEditResult behavior from Popup to this object.
     * 
     * @return {html} Returns a html block of Popup component. 
	 */
    render() {
        const { field, iconName, details, editing, handleEditResult } = this.props;
        return (
            <div className='profile_row'>
                <Icon iconName={iconName}/>
                {editing ? (<input type="text" value={this.state.item} placeholder="Input"
                        onChange={this.handleChange.bind(this)} />)
                        : (<span>{details}</span>)
                }
            </div>
        );
        
    }
}

export default ProfileRow;