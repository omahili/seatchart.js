import { DEFAULT_CURRENCY } from 'utils/consts';
import Options from 'types/options';
import utils from 'utils';
import ContainerUI from 'components/common/container.ui';
import Title from 'components/common/title.ui';

/**
 * @internal
 */
class LegendUI {
    private options: Options;

    public constructor(options: Options) {
        this.options = options;

        this.createLegend();
    }

    /**
     * Creates a legend item and applies a type and a backgroundColor if needed.
     * @param content - The text in the legend that explains the type of seat.
     * @param type - The type of seat.
     * @param backgroundColor - The background color of the item in the legend.
     * @returns The legend item.
     */
    private createLegendItem(content: string, type: string, backgroundColor?: string): HTMLLIElement {
        const item = document.createElement('li');
        item.className = 'sc-legend-item';
        const itemStyle = document.createElement('div');
        itemStyle.className = `sc-seat legend-style ${type}`;
        const demapription = document.createElement('p');
        demapription.className = 'sc-legend-description';
        demapription.textContent = content;

        if (backgroundColor !== undefined) {
            itemStyle.className = `${itemStyle.className} clicked`;
            itemStyle.style.backgroundColor = backgroundColor;
        }

        item.appendChild(itemStyle);
        item.appendChild(demapription);

        return item;
    }

    /**
     * Creates a legend list.
     * @returns The legend list.
     */
    private createLegendList(): HTMLUListElement {
        const list = document.createElement('ul');
        list.className = 'sc-legend';

        return list;
    }

    /**
     * Creates the legend of the seatmap.
     */
    private createLegend(): void {
        if (this.options.legend) {
            // create legend container
            const legendContainer = new ContainerUI('legend', 'column');
            const legendTitle = new Title('Legend');

            const seatsList = this.createLegendList();
            const currency = this.options.cart?.currency || DEFAULT_CURRENCY;

            for (const seatType of this.options.types) {
                const demapription = `${utils.capitalizeFirstLetter(seatType.type)} ` +
                    currency +
                    seatType.price.toFixed(2);
                const item = this.createLegendItem(demapription, '', seatType.backgroundColor);
                seatsList.appendChild(item);
            }
            seatsList.appendChild(this.createLegendItem('Already booked', 'unavailable'));

            legendContainer.element.appendChild(legendTitle.element);
            legendContainer.element.appendChild(seatsList);
            legendContainer.element.appendChild(seatsList);

            const legend = document.getElementById(this.options.legend.id);

            if (legend) {
                legend.appendChild(legendContainer.element);
            }
        }
    }
}

export default LegendUI;
