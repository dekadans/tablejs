tablejs
=======

tablejs is a small jQuery plug-in to automatically create sortable HTML-tables from CSV-files.

Live example
------------

http://dev.tthe.se/tablejs/

How to use
----------

Include both jQuery and table.js.

Create a table-element with a source specified:

    <table src="values.csv"></table>

Call tablejs:

    $('table').tablejs({
        // options goes here
    });


Options
-------

    ignorecolumns (array) : An array of integers indicating which (if any) columns should be ignored (starts at 0)
    ignorerows (array) : An array of integers indicating which (if any) rows should be ignored (starts at 0)
    separator (char (default: ',')) : The character used for separating values in the CSV-file
    titlesfirst (bool (default: false)) : If the first row contains column titles. Uses <th> instead of <td> and offers sortability.
    wrap (char (default: '"')) : The characters used when values in the file are wrapped


Styling
-------

All generated elements includes specific classes to be used when styling.

    class=tablejs-table : The main table
    class=tablejs-tr : A row (<tr>)
    class=tablejs-trh : The header row (the first <tr>, if titlesfirst is true)
    class=tablejs-th : Header element (<th>)
    class=tablejs-td : Element (<td>)

Future
------

This is just a small project on my spare time, and the intention was to keep it simple, but I might add functionality over time.