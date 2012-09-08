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
    
    var findInRow = function(row, ci) {
        columns = $(row).find('td');
        column = columns[ci];
        
        text = $(column).text();
        
        if (isNaN(text))
        {
            return text;
        }
        else
        {
            return parseInt(text, 10);
        }
    };
    
    $.fn.tablejs = function(attr) {
        if (attr == null) attr = {};
        
        attr = $.extend({
            'titlesfirst' : false,
            'ignorerows' : [],
            'separator' : ',',
            'wrap' : '"',
            'ignorecolumns' : []
        }, attr);
        
        
        if (this.is('table') && this.attr('src') != null)
        {
            var csv = this.attr('src');
            var elm = this;
            var text = '';
            
            elm.html('<tr><td>Loading data</td></tr>');
            
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
                            text += '<th class="tablejs-th"><a href="#" rel="'+ c +'" class="tablejs-sort">' + elems[i] + '</a></th>';
                        }
                    }
                    else
                    {
                        text += '<tr class="tablejs-tr">';
                        
                        for (i in elems)
                        {
                            text += '<td class="tablejs-td">' + elems[i] + '</td>';
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
                        text += '<tr class="tablejs-tr">';
                        
                        elems = parseRow(datarows[r], attr.separator, attr.wrap, attr.ignorecolumns);
                        
                        for (e in elems)
                        {
                            text += '<td class="tablejs-td">' + elems[e] + '</td>';
                        }
                        
                        text += '</tr>';
                    }
                }
                
                elm.html(text);
                
                elm.find('.tablejs-sort').click(function(e){
                    e.preventDefault();
                    var sortby = $(this).attr('rel');
                    var sortrows = elm.find('tr:not(.tablejs-trh)');
                    var mode = ($(this).data('mode') == 'asc' ? 'desc' : 'asc');
                    
                    elm.find('.tablejs-sort').data('mode','');
                    $(this).data('mode', mode);
                    
                    for (i = 0; i < sortrows.length; i++)
                    {
                        temp = i;
                        for (j = i+1; j < sortrows.length; j++)
                        {
                            if (mode == 'asc')
                            {
                                if (findInRow(sortrows[j], sortby) < findInRow(sortrows[temp], sortby))
                                {
                                    temp = j;
                                }
                            }
                            else if (mode == 'desc')
                            {
                                if (findInRow(sortrows[j], sortby) > findInRow(sortrows[temp], sortby))
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
            });
        }
    }
})(jQuery);