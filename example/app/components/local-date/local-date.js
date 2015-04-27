/**
 * @module LocalDate
 * @extends React.Component
 */
export default class LocalDate extends React.Component {

    /**
     * @method render
     * @return {Object}
     */
    render() {

        return React.createElement('date', null, 'Current Date: ' + new Date().getDate() + '/'
                                                                  + new Date().getMonth() + '/'
                                                                  + new Date().getFullYear());
    }

}