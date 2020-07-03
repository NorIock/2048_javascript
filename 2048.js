(function($)
{
    $.fn.game2048 = function()
    {
        var start_again = $(this);
        var x_size = 4;
        var y_size = 4;
        var score = 0;


        createGrid(x_size, y_size);

        $(this).append("<h3>Welcome to 2048</h3>")
        $(this).append("<div id = 'select'><label for ='size'>Grid size: </label><select id = 'size'><option value = '4'>4x4</option><option value = '5'>5x5</option><option value = '6'>6x6</option></div>");
        $(this).append("<button id = 'restart'>Restart</button><button id = 'rules'>Rules</button>");
        $(this).append("<div id = 'score'>Your score: "+score+"</div>");
        $(this).append(createGrid(x_size, y_size));

        generate_tiles(2, x_size, y_size); // 2 tuiles car il y en a 2 en début de partie (il faudra voir comment en mettre une seule après chaque coup joué)

        mouvement();

        $("#restart").click(function()
        {
            new_game(start_again);
            generate_tiles(2, x_size, y_size);
        })

        $("#rules").click(function()
        {
            alert("2048 is played on a gray 4×4 grid, with numbered tiles that slide smoothly when a player moves them using the four arrow keys.Every turn, a new tile will randomly appear in an empty spot on the board with a value of either 2 or 4. Tiles slide as far as possible in the chosen direction until they are stopped by either another tile or the edge of the grid. If two tiles of the same number collide while moving, they will merge into a tile with the total value of the two tiles that collided. The resulting tile cannot merge with another tile again in the same move. Higher-scoring tiles emit a soft glow. If a move causes three consecutive tiles of the same value to slide together, only the two tiles farthest along the direction of motion will combine. If all four spaces in a row or column are filled with tiles of the same value, a move parallel to that row/column will combine the first two and last two. A scoreboard on the upper-right keeps track of the user's score. The user's score starts at zero, and is increased whenever two tiles combine, by the value of the new tile.");
        })

        $('#select-4').click(function(e)
        {
            $('#size option[value="4"]').prop('selected', true);
            y_size = 4;
            x_size = 4;
            new_game(start_again);
        });

        $('#select-5').click(function(e)
        {
            $('#size option[value="5"]').prop('selected', true);
            y_size = 5;
            x_size = 5;
            new_game(start_again);
        });

        $('#select-6').click(function(e)
        {
            $('#size option[value="4"]').prop('selected', true);
            y_size = 6;
            x_size = 6;
            new_game(start_again);
        });

        function new_game(table)
        {
            table.empty();
            table.append("<h3>Welcome to 2048</h3>");
            score =0;
            table.append("<div id = 'select'><label for ='size'>Grid size: </label><select id = 'size'><option value = '4'>4x4</option><option value = '5'>5x5</option><option value = '6'>6x6</option></div>");
            table.append("<button id = 'restart'>Restart</button><button id = 'rules'>Rules</button>");
            table.append("<div id = 'score'>Your score: "+score+"</div>");
            table.append(createGrid(x_size, y_size));
            generate_tiles(2, x_size, y_size);
            $("#restart").click(function()
            {
                new_game(start_again);
            })
        }

        function my_score()
        {
            element = $("#score");
            element.empty().append("Your score: "+score);
        }

        function createGrid(x_size, y_size)
        {
        
            let table = $("<table></table>")
        
            for(let y = 0; y < y_size; y++) // y = axe des ordonnées, pour faire les 4 lignes
            {
                let line = $("<tr></tr>"); // créé les lignes du tableau
        
                for(let x = 0; x < x_size; x++) // x = axe des abscisses, pour faire les 4 colonnes du tableau
                {
                    let table_case = $("<td></td>").attr("x", x).attr("y", y).attr("nbr", 0); //on enregistre les valeurs à 0 et on créé des coordonnées x, y
                    line.append(table_case);
                }
                table.append(line);
            }
            return table;
        }

        function generate_nbr(size_nbr)
        {
            return (Math.floor(Math.random() * size_nbr)); // génère un chiffre entre 0 et 3
        }

        function tile_value()
        {
            if(generate_nbr(4 + 2) != 4) // 4 car le carré, à la base est en 4x4 et +2 à size pour réduire la probabilité d'avoir un 4
            {
                return 2;
            }
            else
            {
                return 4;
            }
        }

        function generate_tiles(nbr_of_tiles, x_size, y_size)
        {
            let x = generate_nbr(x_size); // génère une abscisse 
            let y = generate_nbr(y_size); // génère une ordonnée

            let value = tile_value();

            for(let i= 0; nbr_of_tiles > i; i++)
            {
                if($( "td[x*='"+x+"'][y*='"+y+"']" ).attr('nbr' ) != 0) // si une tuile a déjà été créée à cette position (en fonction de x et y)
                {
                    generate_tiles(nbr_of_tiles - i, x_size, y_size) //relance generate_tile. nbr_of_tiles - i au cas ou une tuile a déjà été générée
                }
                else
                {
                    $( "td[x*='"+x+"'][y*='"+y+"']" ).attr('nbr', value).append(value).addClass("color_"+value); // On attribute une valeur à une case au hasard et on affiche cette valeur avec append et on applique la classe pour la couleur
                }

            }
        }

        function fusion_tiles(slot_A, slot_B)
        {
            let value = (slot_B.attr('nbr') * 2); // prend la valeur des 2 tuiles (x2 car même valeur)
            score += value;
            slot_A.attr('nbr', value); // on attribue la valeur des 2 tuiles à une tuile 
            slot_A.empty().removeClass(); // on vide, pour éviter que l'ancienne valeur ait un impact (pour avoir 4 au lieu de 2 4)
            if(slot_A.attr('nbr') !== "0")
            {
                slot_A.append(value).addClass("color_"+value); // on affiche la nouvelle valeur
            }
            slot_B.empty().removeClass(); // on vide l'ancienne tuile
            slot_B.attr('nbr', 0); // et on lui attribue la valeur de 0
            if(value == 256)
            {
                sound_256();
            }
            if(value == 512)
            {
                sound_512();
            }
            if(value == 1024)
            {
                sound_1024();
            }
            if(value == 2048)
            {
                you_win();
            }
        }
        
        function move_tile(empty_slot, full_slot)
        {
            let value = full_slot.attr('nbr');
            empty_slot.attr('nbr', value).empty().append(value).addClass("color_"+value);
            full_slot.empty().attr('nbr', 0).removeClass();
        }

        function mouvement()
        {
            $(document).keydown(function(event) // keydown plus que keypress car key prends en compte toutes les touches du clavier
            {
                my_score();

                switch(event.keyCode)
                {
                    case 18:
                    break;

                    case 37:
                        move_left(x_size, y_size);
                        sound_move();
                    break;

                    case 38:
                        move_up(x_size, y_size);
                        sound_move();
                    break;

                    case 39:
                        move_right(x_size, y_size);
                        sound_move();
                    break;

                    case 40:
                        move_down(x_size, y_size);
                        sound_move();
                    break;

                    default:
                    alert("use letf, up, right or down arrows to play");
                    break;
                }  
            })
        }
        
        function move_left(x_size, y_size)
        {
            let mouvement_done = false;
            for (let y = 0; y < y_size; y++)
            {
                for(let x = 0; x < x_size; x++)
                {
                    let selected_tile = $( "td[x*='"+x+"'][y*='"+y+"']" );
                    let value_selected_tile = selected_tile.attr('nbr');

                    if(value_selected_tile == "0")
                    {
                        for(let i = x + 1; i < x_size; i++)
                        {
                            let next_selected_tile = $( "td[x*='"+i+"'][y*='"+y+"']" );
                            let value_next_selected_tile = next_selected_tile.attr('nbr');

                            if(value_next_selected_tile == "0")
                            {
                                continue;
                            }

                            else if(value_next_selected_tile != "0")
                            {
                                move_tile(selected_tile, next_selected_tile);
                                x--;
                                mouvement_done = true;
                                break;
                            }
                        }
                    }

                    else if (value_selected_tile != "0")
                    {
                        for(let i = x + 1; i < x_size; i++)
                        {
                            let next_selected_tile = $( "td[x*='"+i+"'][y*='"+y+"']" );
                            let value_next_selected_tile = next_selected_tile.attr('nbr');

                            if(value_next_selected_tile == "0")
                            {
                                continue;
                            }

                            else if (value_selected_tile != value_next_selected_tile)
                            {
                                break;
                            }

                            else if (value_selected_tile == value_next_selected_tile)
                            {
                                fusion_tiles(selected_tile, next_selected_tile);
                                mouvement_done = true;
                                break;
                            }
                        }
                    }

                }
            }
            if(mouvement_done == true) // vérifie qu'un mouvement ou une fusion a été effectuée avant de générée une nouvelle tuile
            {
                generate_tiles(1, x_size, y_size);
            }
            you_lose();
        }

        function move_right(x_size, y_size) // à faire
        {
            let mouvement_done = false;
            for (let y = 0; y < y_size; y++)
            {
                for(let x = (x_size - 1); x >= 0; x--)
                {
                    let selected_tile = $( "td[x*='"+x+"'][y*='"+y+"']" );
                    let value_selected_tile = selected_tile.attr('nbr');

                    if(value_selected_tile == "0")
                    {
                        for(let i = x - 1; i >= 0; i--)
                        {
                            let next_selected_tile = $( "td[x*='"+i+"'][y*='"+y+"']" );
                            let value_next_selected_tile = next_selected_tile.attr('nbr');

                            if(value_next_selected_tile == "0")
                            {
                                continue;
                            }

                            else if(value_next_selected_tile != "0")
                            {
                                move_tile(selected_tile, next_selected_tile);
                                x++;
                                mouvement_done = true;
                                break;
                            }
                        }
                    }

                    else if (value_selected_tile != "0")
                    {
                        for(let i = x - 1; i >= 0; i--)
                        {
                            let next_selected_tile = $( "td[x*='"+i+"'][y*='"+y+"']" );
                            let value_next_selected_tile = next_selected_tile.attr('nbr');

                            if(value_next_selected_tile == "0")
                            {
                                continue;
                            }

                            else if (value_selected_tile != value_next_selected_tile)
                            {
                                break;
                            }

                            else if (value_selected_tile == value_next_selected_tile)
                            {
                                fusion_tiles(selected_tile, next_selected_tile);
                                mouvement_done = true;
                                break;
                            }
                        }
                    }

                }
            }
            if(mouvement_done == true) // vérifie qu'un mouvement ou une fusion a été effectuée avant de générée une nouvelle tuile
            {
                generate_tiles(1, x_size, y_size);
            }
            you_lose();
        }

        function move_up(x_size, y_size) // à faire
        {
            let mouvement_done = false;
            for (let x = 0; x < x_size; x++)
            {
                for(let y = 0; y < y_size; y++)
                {
                    let selected_tile = $( "td[x*='"+x+"'][y*='"+y+"']" );
                    let value_selected_tile = selected_tile.attr('nbr');

                    if(value_selected_tile == "0")
                    {
                        for(let i = y + 1; i < y_size; i++)
                        {
                            let next_selected_tile = $( "td[x*='"+x+"'][y*='"+i+"']" );
                            let value_next_selected_tile = next_selected_tile.attr('nbr');

                            if(value_next_selected_tile == "0")
                            {
                                continue;
                            }

                            else if(value_next_selected_tile != "0")
                            {
                                move_tile(selected_tile, next_selected_tile);
                                y--;
                                mouvement_done = true;
                                break;
                            }
                        }
                    }

                    else if (value_selected_tile != "0")
                    {
                        for(let i = y + 1; i < y_size; i++)
                        {
                            let next_selected_tile = $( "td[x*='"+x+"'][y*='"+i+"']" );
                            let value_next_selected_tile = next_selected_tile.attr('nbr');

                            if(value_next_selected_tile == "0")
                            {
                                continue;
                            }

                            else if (value_selected_tile != value_next_selected_tile)
                            {
                                break;
                            }

                            else if (value_selected_tile == value_next_selected_tile)
                            {
                                fusion_tiles(selected_tile, next_selected_tile);
                                mouvement_done = true;
                                break;
                            }
                        }
                    }

                }
            }
            if(mouvement_done == true) // vérifie qu'un mouvement ou une fusion a été effectuée avant de générée une nouvelle tuile
            {
                generate_tiles(1, x_size, y_size);
            }
            you_lose();
        }

        function move_down(x_size, y_size) // à faire
        {
            let mouvement_done = false;
            for (let x = 0; x < x_size; x++)
            {
                for(let y = (y_size - 1); y >= 0; y--)
                {
                    let selected_tile = $( "td[x*='"+x+"'][y*='"+y+"']" );
                    let value_selected_tile = selected_tile.attr('nbr');

                    if(value_selected_tile == "0")
                    {
                        for(let i = y - 1; i >= 0; i--)
                        {
                            let next_selected_tile = $( "td[x*='"+x+"'][y*='"+i+"']" );
                            let value_next_selected_tile = next_selected_tile.attr('nbr');

                            if(value_next_selected_tile == "0")
                            {
                                continue;
                            }

                            else if(value_next_selected_tile != "0")
                            {
                                move_tile(selected_tile, next_selected_tile);
                                y++;
                                mouvement_done = true;
                                break;
                            }
                        }
                    }

                    else if (value_selected_tile != "0")
                    {
                        for(let i = y - 1; i >= 0; i--)
                        {
                            let next_selected_tile = $( "td[x*='"+x+"'][y*='"+i+"']" );
                            let value_next_selected_tile = next_selected_tile.attr('nbr');

                            if(value_next_selected_tile == "0")
                            {
                                continue;
                            }

                            else if (value_selected_tile != value_next_selected_tile)
                            {
                                break;
                            }

                            else if (value_selected_tile == value_next_selected_tile)
                            {
                                fusion_tiles(selected_tile, next_selected_tile);
                                mouvement_done = true;
                                break;
                            }
                        }
                    }

                }
            }
            if(mouvement_done == true) // vérifie qu'un mouvement ou une fusion a été effectuée avant de générée une nouvelle tuile
            {
                generate_tiles(1, x_size, y_size);
            }
            you_lose();
        }

        function check_possible_movement(x_size, y_size)
        {
            let empty = false;
            for (let y = 0; y < y_size; y++)
            {
                for (let x = 0; x < x_size; x++)
                {
                    if ($( "td[x*='"+x+"'][y*='"+y+"']" ).attr('nbr') == "0")
                    {
                        empty = true;
                    }
                }
            }
            if (empty == true)
            {
                return true;
            }

            else
            {
                for (let y = 0; y < y_size; y++)
                {
                    for (let x = 0; x < x_size; x++)
                    {
                        let value = $( "td[x*='"+x+"'][y*='"+y+"']" ).attr('nbr');
                        let next_value = $( "td[x*='"+(x + 1)+"'][y*='"+y+"']" ).attr('nbr');
                        let value_under = $( "td[x*='"+x+"'][y*='"+(y + 1)+"']" ).attr('nbr');

                        if(value == next_value || value == value_under)
                        {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        function you_lose()
        {
            if(check_possible_movement(x_size, y_size) == false)
            {
                // alert("You lose");
                let audio_bis = new Audio("lose.wav");
                audio_bis.play();
                if(confirm("Voulez vous rejouer ?") == true)
                {
                    new_game(start_again);
                }
            }
        }

        function you_win()
        {
            // alert("you win");
            let audio_bis = new Audio("win.wav");
            audio_bis.play();
            if(confirm("Voulez vous continuer ?") == false)
            {
                new_game(start_again);
            }
        }

        function sound_256()
        {
            var audio = new Audio('Hadoken.wav');
            audio.play();
        }

        function sound_512() 
        {
            var audio = new Audio('helicopter.wav');
            audio.play();
        }

        function sound_1024()
        {
            var audio = new Audio('Shoryuken.wav');
            audio.play();
        }

        function sound_move()
        {
            // var audio = new Audio('Tribal-war-horn.mp3');
            audio.play();
        }

    
    }

})(jQuery);