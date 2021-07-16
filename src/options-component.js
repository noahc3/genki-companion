import React from 'react';
import './index.css';

export default class OptionsComponent extends React.Component {
    render() {
        const title = this.props.title;
        const identifier = this.props.identifier;
        const options = this.props.options;
        const type = this.props.type;
        const callback = this.props.callback;

        const elems = Object.keys(options).map((key) => {
            return (
                <label key={key} class="options-item">
                    <input type={type} value={key} name={identifier} checked={options[key].value} onChange={callback} />
                    {options[key].name}
                </label>
            )
        });

        return (
            <div class="options-container">
                <div>
                    <span class="bold">{title}</span>
                    <div>
                        {elems}
                    </div>
                </div>
            </div>
        );
    }
}