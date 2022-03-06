# Seatchart

Create beautiful designed seat maps 💺🗺️

- [Demo](https://seatchart.js.org/demo.html)
- [Docs](https://seatchart.js.org)

## Usage

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Seatchart Example</title>

    <link rel="stylesheet" href="path/to/seatchart.min.css">
    <style>
      .economy {
        color: white;
        background-color: #43aa8b;
      }
    </style>
  </head>
  <body>
    <div id="container"></div>

    <script type="text/javascript" src="path/to/seatchart.min.js"></script>
    <script>
      var element = document.getElementById('container');
      var options = {
        map: {
          rows: 7,
          columns: 7,
          seatTypes: {
            default: {
              label: 'Economy',
              cssClass: 'economy',
              price: 10,
            },
          },
        },
      };

      var sc = new Seatchart(element, options);
    </script>
  </body>
</html>
```

## Example with React

```javascript
// Seatchart.tsx
import React, { forwardRef, useEffect, useRef } from 'react';
import SeatchartJS, { Options } from 'path/to/seatchart';

interface SeatchartProps {
  options: Options;
}

function setForwardedRef<T>(ref: React.ForwardedRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
};

const Seatchart = forwardRef<SeatchartJS | undefined, SeatchartProps>(({ options }, ref) => {
  const seatchartRef = useRef<SeatchartJS>();
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current && !seatchartRef.current) {
      seatchartRef.current = new SeatchartJS(elementRef.current, options);

      setForwardedRef(ref, seatchartRef.current);

      return () => {
        seatchartRef.current = undefined;
        setForwardedRef(ref, undefined);
      };
    }
  }, []);

  return (
    <div ref={elementRef} />
  );
});

export default Seatchart;

// App.css
.economy {
  color: white;
  background-color: #43aa8b;
}

// App.tsx
import React, { useRef } from 'react';
import SeatchartJS, { Options } from 'path/to/seatchart';
import Seatchart from './Seatchart';

import 'path/to/seatchart/dist/seatchart.min.css';
import './App.css';

const options: Options = {
  map: {
    rows: 7,
    columns: 7,
    seatTypes: {
      default: {
        label: 'Economy',
        cssClass: 'economy',
        price: 10,
      },
    },
  },
};

const App = () => {
  const seatchartRef = useRef<SeatchartJS>();

  const handleClick = () => {
    const index = { row: 0, col: 6 };
    const seat = seatchartRef.current?.getSeat(index);

    seatchartRef.current?.setSeat(index, {
      state: seat?.state === 'selected' ? 'available' : 'selected',
    });
  };

  return (
    <div>
      <button onClick={handleClick}>Toggle Seat</button>
      <Seatchart ref={seatchartRef} options={options} />
    </div>
  );
}

export default App;
```
