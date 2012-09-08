tablejs
=======

tablejs is a small jQuery plug-in to automatically create HTML-tables from CSV-files.

Live example
------------

(dev.tthe.se)[http://dev.tthe.se/tablejs/]

How to use
----------

Include both jQuery and table.js.

Create a table-element with a source specified: <table src="values.csv"></table>

Call tablejs:

    $('table').tablejs({
        // options goes here
    });


Options
-------

    ignorecolumns (array) : An array of integers indicating which (if any) columns should be ignored (starts at 0)
    ignorerows (array) : An array of integers indicating which (if any) rows should be ignored (starts at 0)
    separator (char (default: ',')) : The character used for separating values in the CSV-file
    titlesfirst (bool (default: false)) : If the first row should use <th>-tags instead of <td>
    wrap (char (default: '"')) : The characters used when values in the file are wrapped


Styling
-------

All generated elements includes specific classes to be used when styling.

    class=tablejs-table : The main table
    class=tablejs-tr : A row (<tr>)
    class=tablejs-trh : The top row (the first <tr>)
    class=tablejs-th : Header element (<th>)
    class=tablejs-td : Element (<td>)
