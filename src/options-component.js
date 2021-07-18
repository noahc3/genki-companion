import React from 'react';
import './index.css';

const NUM_PER_COL = 10;
export default class OptionsComponent extends React.Component {

    render() {
        const title = this.props.title;
        const identifier = this.props.identifier;
        const type = this.props.type;
        const callback = this.props.callback;
        const options = this.props.options;
        const dividedOptions = [];

        let i = 0;
        Object.keys(options).forEach(key => {
            const col = Math.floor(i / NUM_PER_COL); 
            if (!dividedOptions[col]) dividedOptions[col] = {};
            dividedOptions[col][key] = options[key];
            i++;
        });

        const elems = dividedOptions.map(colItems => {
            const col = Object.keys(colItems).map(key => {
                return (
                    <label key={key} class="options-item">
                    <input type={type} value={key} name={identifier} checked={colItems[key].value} onChange={callback} />
                    {colItems[key].name}
                </label>
                )
            });

            return (
                 <div class="options-column">
                     {col}
                 </div>
            );
        })

        //const elems = Object.keys(options).map((key) => {
        //    return (
        //        <label key={key} class="options-item">
        //            <input type={type} value={key} name={identifier} checked={options[key].value} onChange={callback} />
        //            {options[key].name}
        //        </label>
        //    )
        //});

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