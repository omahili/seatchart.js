import Seatchart from 'seatchart';
import { DEFAULT_CURRENCY } from 'utils/consts';
import Options from 'utils/options';
import utils from 'utils/utils';

class Legend {
    private sc: Seatchart;
    private options: Options;

    public constructor(map: Seatchart) {
        this.sc = map;
        this.options = map.options;

        this.createLegend();
    }

    /**
     * Creates a legend item and applies a type and a backgroundColor if needed.
     * @param {string} content - The text in the legend that explains the type of seat.
     * @param {string} type - The type of seat.
     * @param {string} [backgroundColor] - The background color of the item in the legend.
     * @returns {HTMLLIElement} The legend item.
     * @private
     */
    private createLegendItem(content: string, type: string, backgroundColor?: string): HTMLLIElement {
        const item = document.createElement('li');
        item.className = 'sc-legend-item';
        const itemStyle = document.createElement('div');
        itemStyle.className = `sc-seat legend-style ${type}`;
        const description = document.createElement('p');
        description.className = 'sc-legend-description';
        description.textContent = content;

        if (backgroundColor !== undefined) {
            itemStyle.className = `${itemStyle.className} clicked`;
            itemStyle.style.backgroundColor = backgroundColor;
        }

        item.appendChild(itemStyle);
        item.appendChild(description);

        return item;
    }

    /**
     * Creates a legend list.
     * @returns {HTMLUnorderedListElement} The legend list.
     * @private
     */
    private createLegendList(): HTMLUListElement {
        const list = document.createElement('ul');
        list.className = 'sc-legend';

        return list;
    }

    /**
     * Creates the legend of the seatmap.
     * @private
     */
    private createLegend(): void {
        if (this.options.legend) {
            // create legend container
            const legendContainer = utils.DOM.createContainer('legend', 'column');
            const legendTitle = utils.DOM.createTitle('Legend');

            const seatsList = this.createLegendList();
            const currency = this.options.cart?.currency || DEFAULT_CURRENCY;

            for (const seatType of this.options.types) {
                const description = `${utils.capitalizeFirstLetter(seatType.type)} ` +
                    currency +
                    seatType.price.toFixed(2);
                const item = this.createLegendItem(description, '', seatType.backgroundColor);
                seatsList.appendChild(item);
            }
            seatsList.appendChild(this.createLegendItem('Already booked', 'unavailable'));

            legendContainer.appendChild(legendTitle);
            legendContainer.appendChild(seatsList);
            legendContainer.appendChild(seatsList);

            const legend = document.getElementById(this.options.legend.id);

            if (legend) {
                legend.appendChild(legendContainer);
            }
        }
    }
}

export default Legend;
