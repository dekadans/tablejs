/**
 *
 * tablejs
 * By Tomas Thelander
 * https://github.com/dekadans/tablejs
 *
 * jQuery plug-in for automatically creating HTML-tables from CSV-files.
 *
 */

(function($) {
    
    /**
     *
     * parseRow()
     * Gets the separate values from a CSV-row
     * 
     * @param string row , one row of the csv
     * @param char sep , the separator between values
     * @param char wrap , the character used when wrapping values
     * @param array ignore , an array of which columns to ignore
     *
     * @return array , an array with the parsed values
     * 
     */
    var parseRow = function(row, sep, wrap, ignore) {
        elems = row.split(sep);
        
        for (i = 0; i < elems.length; i++)
        {
            if (elems[i][0] == wrap && elems[i][elems[i].length-1] == wrap)
            {
                elems[i] = elems[i].substr(1, elems[i].length-2);
            }
            else if (elems[i][0] == wrap && elems[i][elems[i].length-1] != wrap)
            {
                for (j = i+1; j < elems.length; j++)
                {
                    elems[i] += ',' + elems[j];
                    
                    if (elems[j][elems[j].length-1] == wrap)
                    {
                        break;
                    }
                }
                
                elems.splice(i+1, j-i);
                
                elems[i] = elems[i].substr(1, elems[i].length-2);
            }
            
        }
        
        for (i = 0; i < elems.length; i++)
        {
            if ($.inArray(i, ignore) > -1)
            {
                delete elems[i];
            }
        }
        
        return elems;
    };
    
    /**
     * 
     * findInRow()
     * Returns a specific value som a table row. Used when sorting.
     *
     * @param DOM row , a DOM-object of a <tr>-element
     * @param int ci , the column from which the value is to be fetched
     * @param array dates , which columns whose values should be returned as timestamps
     * 
     */
    var findInRow = function(row, ci, dates) {
        columns = $(row).find('td');
        column = columns[ci];
        
        text = $(column).text();
        if (isNaN(text))
        {
            if ($.inArray(parseInt(ci,10), dates) > -1)
            {
                d = new Date(text);
            
                if (isNaN(d.getTime()))
                {
                    return text;
                }
                else
                {
                    return d.getTime();
                }
            }
            else
            {
                return text;
            }
        }
        else
        {
            return parseInt(text, 10);
        }
    };
    
    /**
     *
     * jQuery.tablejs
     *
     */
    $.fn.tablejs = function(attr) {
        if (attr == null) attr = {};
        
        attr = $.extend({
            'titlesfirst' : false,
            'ignorerows' : [],
            'separator' : ',',
            'wrap' : '"',
            'ignorecolumns' : [],
            'datecolumns' : [],
            'symbols' : true,
            'startsorted' : false,
            'sorting' : true
        }, attr);
        
        // The element must be a table and have a source
        if (this.is('table') && this.attr('src') != null)
        {
            var csv = this.attr('src');
            var elm = this;
            var text = '';
            
            elm.html('<tr><td>Loading data</td></tr>');
            
            // Gets CSV data
            $.get(csv, function(data){
                elm.removeAttr('src');
                elm.addClass('tablejs-table');
                
                data = data.replace(/(\r\n)/gm,"\n");
                datarows = data.split("\n");
                
                if ($.inArray(0,attr.ignorerows) == -1)
                {
                    elems = parseRow(datarows[0], attr.separator, attr.wrap, attr.ignorecolumns);
                    
                    if (attr.titlesfirst)
                    {
                        text += '<tr class="tablejs-tr tablejs-trh">';
                        
                        for (i = 0, c = 0; i < elems.length; i++, c++)
                        {
                            if (typeof elems[i] == 'undefined')
                            {
                                c--;
                                continue;
                            }
                            
                            text += '<th class="tablejs-th">';
                            
                            if (attr.sorting)
                            {
                                text += '<a href="#" rel="'+ c +'" class="tablejs-sort">' + elems[i] + '</a>';
                                
                                if (attr.symbols)
                                {
                                    text += ' <span class="tablejs-sortsymbol">&#8211;</span>';
                                }
                            }
                            else
                            {
                                text += elems[i];
                            }
                            
                            text += '</th>';
                        }
                    }
                    else
                    {
                        text += '<tr class="tablejs-tr">';
                        
                        for (i in elems)
                        {
                            text += '<td class="tablejs-td tablejs-td-c0">' + elems[i] + '</td>';
                        }
                    }
                    
                    text += '</tr>';
                }
                
                for (r = 1; r < datarows.length; r++)
                {
                    if ($.inArray(r,attr.ignorerows) > -1)
                    {
                        continue;
                    }
                    if (datarows[r] != '')
                    {
                        text += '<tr class="tablejs-tr tablejs-tr-r'+ r +'">';
                        
                        elems = parseRow(datarows[r], attr.separator, attr.wrap, attr.ignorecolumns);
                        
                        for (e in elems)
                        {
                            text += '<td class="tablejs-td tablejs-td-c'+ e +'">' + elems[e] + '</td>';
                        }
                        
                        text += '</tr>';
                    }
                }
                
                elm.html(text);
                
                /*
                    Sorting using a Selection Sort algorithm.
                    It's quite slow on bigger tables, but then again, tablejs is not built for displaying hundreds or thousands of rows.
                */
                elm.find('.tablejs-sort').click(function(e){
                    e.preventDefault();
                    var sortby = $(this).attr('rel');
                    var sortrows = elm.find('tr:not(.tablejs-trh)');
                    var mode = ($(this).data('mode') == 'asc' ? 'desc' : 'asc');
                    
                    elm.find('.tablejs-sort').data('mode','');
                    elm.find('.tablejs-td').removeClass('tablejs-td-sort');
                    elm.find('.tablejs-td-c' + sortby).addClass('tablejs-td-sort');
                    $(this).data('mode', mode);
                    
                    if (attr.symbols)
                    {
                        cols = $('tr.tablejs-trh').find('th');
                        $('span.tablejs-sortsymbol').replaceWith('<span class="tablejs-sortsymbol">&#8211;</span>');
                        
                        symbol = (mode == 'asc') ? '&#708;' : '&#709;';
                        
                        $(cols[sortby]).find('span.tablejs-sortsymbol').replaceWith('<span class="tablejs-sortsymbol">'+ symbol +'</span>');
                    }
                    
                    for (i = 0; i < sortrows.length; i++)
                    {
                        temp = i;
                        for (j = i+1; j < sortrows.length; j++)
                        {
                            if (mode == 'asc')
                            {
                                if (findInRow(sortrows[j], sortby, attr.datecolumns) < findInRow(sortrows[temp], sortby, attr.datecolumns))
                                {
                                    temp = j;
                                }
                            }
                            else if (mode == 'desc')
                            {
                                if (findInRow(sortrows[j], sortby, attr.datecolumns) > findInRow(sortrows[temp], sortby, attr.datecolumns))
                                {
                                    temp = j;
                                }
                            }
                        }
                        temp2 = sortrows[temp];
                        sortrows[temp] = sortrows[i];
                        sortrows[i] = temp2;
                    }
                    
                    elm.find('tr:not(.tablejs-trh)').remove();
                    elm.append(sortrows);
                });
                
                if (attr.startsorted != false)
                {
                    $('.tablejs-sort[rel="'+ attr.startsorted +'"]').click();
                }
            });
        }
    }
})(jQuery);