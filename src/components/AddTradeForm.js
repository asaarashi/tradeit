import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

class AddTradeForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            companyName: "",
            quantity: ""
        };
    }

    handleSubmit = () => {
        const {companyName, quantity} = this.state;
        const {onSubmit} = this.props;
        onSubmit && onSubmit(companyName.trim(), Number(quantity));
    };

    onChange(event, key) {
        this.setState({
            [key]: event.target.value
        });
    }

    clearInputs() {
        this.setState({
            companyName: "",
            quantity: ""
        });
    }

    render() {
        const {companyName, quantity} = this.state;
        return (
            <div className="trade-form-container">
                <ValidatorForm className="trade-form" noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                    <Grid container item xs={6} spacing={2}>
                        <Grid container item xs={4} spacing={1}>
                            <TextValidator
                                id="companyName"
                                name="companyName"
                                label="Company name"
                                value={companyName}
                                validators={['required']}
                                errorMessages={['This field is required']}
                                onChange={(event) => this.onChange(event, 'companyName')}
                            />
                        </Grid>
                        <Grid container item xs={4} spacing={1}>
                            <TextValidator
                                id="quantity"
                                name="quantity"
                                label="Quantity"
                                value={quantity}
                                validators={['required', 'matchRegexp:^-?[1-9][0-9]*$']}
                                errorMessages={['This field is required', 'Please input a valid quantity']}
                                onChange={(event) => this.onChange(event, 'quantity')}/>
                        </Grid>
                        <Grid container item xs={4} spacing={1}>
                            <Button variant="contained" type="submit" color="primary">
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </div>
        );
    }
}

export default AddTradeForm;