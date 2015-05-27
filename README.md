# thermal printer for tessel

1. power printer with 5-9v supply (seperate to Tessel)
2. update baudrate in code (you can find this on the test print by holding button on printer while powering)
3. use A, B, D ports. c doesn't support uart. ground (printer) to ground (tessel pin 0), rx (printer) to tx/g1 (tessel pin 8)
4. see example code for usage and original thermal printer for usage of the printer stuff: https://github.com/xseignard/thermalPrinter

# todo
1. proper async for print function
2. implement some kind of images functionality
3. add back in tests/rework to styleguide for tessel modules
4. better docs than this cmonnn
