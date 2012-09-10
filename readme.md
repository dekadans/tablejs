tablejs
=======

tablejs is a small jQuery plug-in to automatically create sortable HTML-tables from CSV-files.

Tested in newer versions of Chrome, Firefox, Internet Explorer and Opera.

Live example
------------

![dev.tthe.se](http://dev.tthe.se/tablejs/)

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

Note about counting columns and rows. Counting always starts at 0, so the first column/row has index 0, the second 1 and so on.

When an option below is marked as "CSV column/row" you should pass an index as it appears in the CSV file.
For example, if you want to hide the third row in the CSV, you add the integer 2 to ignorerows.

When it says "Displayed columns" you should pass an index to a column as it appears in the finished table.
So if you want the third column in the CSV file to be sorted as dates, and have ignored the first column using ignorecolumns,
the third column in the file will appear as the second column in the table, and the index you should add to datecolumns is 1 (the second index).

*datecolumns*

    (array) : An array of integers indicating which (if any) columns should be treated as dates and/or times when sorting the table. Displayed columns.

*ignorecolumns*

    (array) : An array of integers indicating which (if any) columns should be ignored (starts at 0). CSV columns.

*ignorerows*

    (array) : An array of integers indicating which (if any) rows should be ignored (starts at 0). CSV rows.

*separator*

    (char (default: ',')) : The character used for separating values in the CSV-file.

*sorting*

    (bool (default: true)) : If the table should be sortable.

*startsorted*
    (int) : Which (if any) column the table should be sorted after upon creation of the table. Displayed columns.

*symbols*

    (bool (default: true)) : If ascending/descending symbols should be displayed when table is sorted.

*titlesfirst*

    (bool (default: false)) : If the first row contains column titles. Uses <th> instead of <td> and offers sortability.

*wrap*

    (char (default: '"')) : The characters used when values in the file are wrapped.


Example Configuration
---------------------

    $('table').tablejs({
        'ignorecolumns' : [0], // Ignores the first column in the CSV
        'ignorerows' : [3], // Ignores the fourth row in the CSV
        'datecolumns' : [1,3], // The 2nd and 4th displayed columns (3rd and 5th since we have ignored one column) are dates/times
        'separator' : ';' // Semicolons are used as separators in the CSV, instead of the standard comma
    });

Styling
-------

All generated elements includes specific classes to be used when styling.

    class=tablejs-table : The main table
    class=tablejs-tr : A row (<tr>)
    class=tablejs-tr-rX : Row (<tr>) number X (replace X with a number). This row changes place when sorting.
    class=tablejs-trh : The header row (the first <tr>, if titlesfirst is true)
    class=tablejs-th : Header element (<th>)
    class=tablejs-td : Element (<td>)
    class=tablejs-td-cX : Elements (<td>) in column number X
    class=tablejs-td-sort : Elements (<td>) in the column the table is currently sorted after
    class=tablejs-sort : Links (<a>) in the header used for sorting
    class=tablejs-sortsymbol : Labels (<span>) with ascending/descending-symbols

Updates
-------

2012-09-10

    Now possible to sort columns by date
    Symbols when sorting (ascending/descending) (may be disabled)
    Turn off sorting
    Display table sorted by a specified column directly
    New element classes
    New design example in index.html


Future
------

This is just a small project on my spare time, and the intention was to keep it simple, but I might add functionality over time.