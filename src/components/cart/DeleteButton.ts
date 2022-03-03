import Base from 'components/Base';

class DeleteButton extends Base<HTMLButtonElement> {
  public constructor(onclick: (e: MouseEvent) => void) {
    const buttonIcon = document.createElement('div');
    buttonIcon.className = 'sc-cart-btn-icon';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'sc-cart-btn-delete';

    deleteBtn.appendChild(buttonIcon);
    deleteBtn.onclick = onclick;

    super(deleteBtn);
  }
}

export default DeleteButton;
