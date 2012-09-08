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
            
            $.get(csv, function(data){
                elm.removeAttr('src');
                elm.addClass('tablejs-table');
                
                data = data.replace(/(\r\n)/gm,"\n");
                datarows = data.split("\n");
                
                if ($.inArray(0,attr.ignorerows) == -1)
                {
                    if (attr.titlesfirst)
                    {
                        var ts = '<th class="tablejs-th">';
                        var te = '</th>';
                    }
                    else
                    {
                        var ts = '<td class="tablejs-td">';
                        var te = '</td>';
                    }
                    
                    elems = parseRow(datarows[0], attr.separator, attr.wrap, attr.ignorecolumns);
                    
                    text += '<tr class="tablejs-tr tablejs-trh">';
                    
                    for (i in elems)
                    {
                        text += ts + elems[i] + te;
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
                
                elm.append(text);
            });
        }
    }
})(jQuery);