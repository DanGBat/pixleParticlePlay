const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

// MOUSE STUFF // FIND THE POSiTION OF THE MOUSE AT ANY TIME
let mouse = {
// FIND THE POSITION OF THE MOUSE AT ANY TIME
    x: null,
    y: null,
// SET THE RADIUS OF THE MOUSE POINTER FOR COLLISION DETECTION
    radius: 100
}

// ADD EVENT LISTENER FOR WHEN EVER THE MOUSE POINTER MOVES
window.addEventListener('mousemove',
    function(event) {
        mouse.x = event.x + canvas.clientLeft/2;
        mouse.y = event.y + canvas.clientTop/2;
    });

// FUNCTION FOR PROPERTIES OF IMAGE SO IT CAN BE CALLED AFTER THE IMAGE HAS LOADED
// STORES THE PIXEL INFORMATION OF AN IMAGE IN VARIABLE CALLED DATA
function drawPixelImage() {
    let imageWidth = png.width;
    let imageHeight = png.height;
    const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
// ONCE THE DATA IS STORED FROM THE IMAGE THE IMAGE CAN BE DELETED (CLEAR CANVAS)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

// THIS CLASS TURNS ALL PARTICLES INTO INDIVIDUAL OBJECTS
// THE CONSTRUCTOR PASSES EACH PIXEL INTO THE CLASS AS AN OBJECT
    class Particle {
        constructor(x, y, color, size) {
            this.x = x + canvas.width/2 - png.width * 2,
            this.y = y + canvas.height/2 - png.height * 2,
            this.color = color,
            this.size = 2,
// PIXELS ORIGINAL STARTING POSITION
            this.baseX = x + canvas.width/2 - png.width * 2,
            this.baseY = y + canvas.height/2 - png.height * 2,
// THIS DETERMINES HOW FAST THE PARTICLES MOVE FROM THE MOUSE POINTER
            this.density = (Math.random() * 10) + 2;
        }
// THIS DRAW FUNCTION CREATES A CIRCLE AROUND EVERY PARTICAL
// AND CHECKS IF IT COLIDES WITH THE MOUSE POINTERS COLLISION CIRCLE
        draw () {
// DRAW BOUNDARY CIRCLE
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
            update() {
                ctx.fillStyle = this.color;

    // COLLISION DETECTION
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
    // COMPARES THE DISTANCE OF THE TWO CENTER POINTS OF MOUSE AND PIXEL CIRCLE
    // IF THE DISTANCE IS LESS THAN TWO RADII OF THE CIRCLES ADDED TOGETHER THEY HAVE COLLIDED
                let distance = Math.sqrt(dx * dx + dy * dy);

    // THESE DETERMINE HOW FAST THE PARTICLE IS BEING PUSHED ON X & Y AXIS
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;

    // SET FORCE DEPENDING ON THE DISTANCE
    // FORCE IS THE VECTOR OF PARTICLES
    // THIS SETS IT VALUE TO BETWEEN 0 & 1 (Close Particles 1 - Far Away 0)
                const maxDistance = 100;
                let force = (maxDistance - distance) / maxDistance;
                if (force < 0) force = 0; // FORCE CAN'T BE NEGATIVE

                let directionX = (forceDirectionX * force * this.density * 0.6);
                let directionY = (forceDirectionY * force * this.density * 0.6);
// THIS IS THE COLLISION DETECTION PART
                if (distance < mouse.radius + this.size) {
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
// CHECKS IF THE PARTICLE ISN'T IN IT'S ORIGINAL POSITION
                    if (this.x !== this.baseX){
                        let dx = this.x - this.baseX;
                        this.x -= dx/20; // DIVIDED BY 20 SLOWS DOWN SPEED TRAVELLING BACK
                    } if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy/20; // DIVIDED BY 20 SLOWS DOWN SPEED TRAVELLING BACK
                    }
                }
                this.draw()
            }
        }
        function init() {
// RE-EMPRIES THE PARTICLE ARRAY
            particleArray = [];
// SCANS THE IMAGE AN EXTRACTS PIXEL INFORMATION A COLUMN OF PIXELS AT A A TIME
            for (let y = 0, y2 = data.height; y < y2; y++) {
                for (let x = 0, x2 = data.width; x < x2; x++) {
                    if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
                        let positionX = x;
                        let positionY = y;
                        let color = "rgb(" + data.data[(y * 4 * data.width) + (x * 4)] + "," +
                                            data.data[(y * 4 * data.width) + (x * 4) + 1] + "," +
                                            data.data[(y * 4 * data.width) + (x * 4) + 2] + ")";
                        particleArray.push(new Particle(positionX * 4, positionY * 4, color));
                    }
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.fillStyle = 'rgba(0,0,0,.05)';
            ctx.fillRect(0, 0, innerWidth, innerHeight);

            for (let i = 0; i < particleArray.length; i++) {
                particleArray[i].update();
            }
        }
    init();
    animate();

// REFIT IMAGE IF BROWSER WINDOW IS ADJUSTED
    window.addEventListener('resize',
        function() {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
// REINITILAISE IMAGE
            init();
        });
}

const png = new Image();
png.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF92lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDYwLCAyMDIwLzA1LzEyLTE2OjA0OjE3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMDgtMjVUMDg6NDY6NTMrMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTA4LTI1VDA4OjQ4OjI1KzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTA4LTI1VDA4OjQ4OjI1KzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg2N2NmOTVjLTBlZGItNDRjMS04NmIxLTg3N2YyZDg0ODgxZSIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjlmYjc2NTY5LTQyMjktYjc0Yy1hMGZkLTcxYzViNTJkNjMyYyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmI0Nzc4M2FjLWI5OTQtNDJlMi04ZTg2LWQwOWM2NWFiMDAzNSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YjQ3NzgzYWMtYjk5NC00MmUyLThlODYtZDA5YzY1YWIwMDM1IiBzdEV2dDp3aGVuPSIyMDIwLTA4LTI1VDA4OjQ2OjUzKzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODY3Y2Y5NWMtMGVkYi00NGMxLTg2YjEtODc3ZjJkODQ4ODFlIiBzdEV2dDp3aGVuPSIyMDIwLTA4LTI1VDA4OjQ4OjI1KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7g+aRVAAA0U0lEQVR4Ae3BB2Ac9YHo4d9/ZrY3rVbVkizZkrstd+OCKQZML6Z3DCEkEAIkIRB6CAQSOkkIzYQSeu8dg3vvlmy5SLK6tNJqe5ud+b/47nElD/s4Ds4OL9+nSSn5p/2Hxj/tVzT+ab+i8U/7FY1/2q9o/NN+RfvwvY9IZVP4ffmgSMpKS1FUjXgiid1uYfDgwVgsFv7e0395jvc/+ZiCggL2RFFV4jp4u5cwlq0e3wjHlYmccpqpi6JRYya3dodjTWR7t4aa5H3Tz22NBCr9xPpyDKxt4utY88RgPqqbyiuvLeGm2cNpdZqsDg5lzphaDh3SyOINHYQSaSw2C3vjtql0RHQe/WIbNpsdaWRJpdM4HQ40TSWjG+RyBna7E1URpNMpFEUllU6DlBhGDsM0yeVy5HIGdpsdl9uJpqlkM1lMU5LLZclks7hcbux2G4ZhIBQwsgZ6XGK1OYhlQ2h8Qzk9QyKs47KZgOSrSCAnMgypcV0xwF99Y9oUhQHNSl84xtZtm0tcFjk5HA7T2m//qX+t4+2JDJybN2wrX5dqlZiG4PtE4xvI6jCsKsqVp72FwxMAyX8mQFUUDAmhNtdJXlH8YHFZOWWlZXjcDjrbW1i3ahFtIUE46aQjnvTXP5u9oLdZrTjmHP0Me1jpNSUI9kxIiREyUR0m3yca34AQkFdUS3h7lkiwFc3KfybB6c0HzcCuZ5/uixj0RfuJ9HYxZmghuXSKnoQbd56XCQcMx7upledfXUBLaPus5/5Q8ks157tWUQRSskemNAmUefEHDEDyfaHxDQhhEIuVUTDqCRzOEKpm49956e1v4pE/zaNKWufUDkt7Q8koCJ2AI8auxgirtyWwW+34HGly6X6GVnqpKFYo8piUVI+ZvGBdGk2VCPbMkAqKAKehA5LvC41vwDBMjFyCqTPHo1nsgODfuYEojZ89Trq98+nmbpVhw0czYnCAHfWr2dScIz8/gM+RoqktyMaGLgxLESceeyjJaA+FzuShBwwJlZum3iaEYE9ME8qKLbQm8tFzgu8LjW9AUQRSKnS39VA2KAE4AQFIIAcMnXTE7MvveGHezZ78ogLKCm2s3bCdhl3g9dpxe9xs2dFHJJomnLRQVCzI9zmIR620dfWhqtEpFhlvk0JhT0xMlIydbNKHoqh8X2h8Q0Jk6ektoSgQw+IJgygCUtDTAvbmRGF+wREWq4aZ7WXBsiydfSmK/BqFXp2m5hZ6eruJpQSheI4hA9OsXldHTU0NmWyKloZg58CBAzF1HZB8FWmaxOxuVGxomomUfC9ofEOKMJBo5KxT2PHZc+zY9CmV1dXUHnkkRHNbdKP9npryqqu3dsTZ3hlnTJlKoSdHtLeLYDiLYinCJooY6g/R3tVISdFU0L3UbVrNJcefdkzVIScsIxZmb0RFMYs/2UBXzzsoynC+DzS+MYFCCodd4YHXN/LYw/cCVhZ/+BgzjjwYj2fKL4/Pv+Pg3kfumdzU1cBZx53GZ9vgwRUbOWWYwjkHHUA0q/PJJ38k2CqZc/BUPl+/CpvuZdDJt2RxDeDr+NMrj9CdTGG3WYE0/+g0vgEhBP9KYTevm/8ryyUX/4iHHziWgoANmXDdF432v3DstBkUTZzJzJI8Ti6fywGWNgYp63l7ySesjxSgHX4TsjgPS+I1pp1w7Mu4rLel4o309GbYI4uFJZ8v5aUXX6M634uiCL4PNPZCCIGiKPw9TVVRhIJAsFsynuBvhMNms3VHtfQVv3qX+35VhibyKnwOH8cefRzYSykvCfPbkk5ISnZtE1QNqOHyUaegDZ3IOKOeBZqbYHbD71e/dTrn/Hwx2xp1vg6vy4WUEgT/8DT2QAhBNqOTTqdxuVx8qampWbTualuUTqSb3Hmu3wDbD5h6IE/Oe9j2ozPHbm/tCD+zYl3HXYtWBJznzi46ar3RY7767qf6qVcOtZFfACkT7AaVh8ymsnoEtO8A8xNCbSE6dZhZgnzstS1sa9T5unqjCYQQfB9o7IEQAiEk3V3dVA2qQlEUujq7WLp46VIhxFSfzzejo6vj3MKuohfPPf/sm7evfS6v2raq3K3nXb/FYfnJax80OA4fLazSDD5/2q9XH/xx1YiyIy64FOgAi8Bs2ULXpnV4nG485RXGp59tJhTtV+2bbcGelWH+O6aPLEcIME3JPzqNvbDZbPQGQwwaPJicrrN82cr5TqdzakVFOVldJz8vn2g4emZxSeGZtz3wVnTpW7/jg7vnUd/a7xs8bjgtPe309Zj26RVuS1/9Rog2g91Bpnkn0S3bSUeTDBg+mCUfrxCPvP0xB47xys+3BkIjxs/ivYb3yfGvBCAB1WZBOvMxsaMZOoM8aWprqjhl0mBC4QjSwT88jb1QVBXNorJy+SrS6fS7hUUFhyKgt7ePYSOGMWhQFX3dXTx4z+1c8MMrvNNPvJHpJ97I5SvW8WHCT3jJJdTFtp18wJyTGeduJvj6ExTOnoPN7cFlt+OpLGXdukZOuekvyoC8NJrVS1y4HpyK+4f3zxxLe3c3Aslzh/2QlqnHcNa4Klbs9LB9pZvi1Ebuy/s1GWs+ndtayRMGoPCPTmMvDMPAZrPh9fjeDYdDx6YzGRLxOCWlJXjcXnKZKPfc90d+d9cdXHvjYxxz5HjOu+AM5px8JjNRSE1+jdHb66nv1bCJLSQjXYSXLcJdPoB0Ko1dM3hr/kq6s0XkO9Kk+rqo9nDx84WXLdzxzO/+6si3QChHMFkGDvCXgKUH0ECxuslkdHoSMUwpURTB94HGVxGCXC6HaWquUaNHfvrQn+6fGgp2c9Ip51BUkM/QESMgE+TRJ57l3ifrsBT/kExvO2+8vZ433v4Ml/NajjhsAi++/hYzJxzAzJwO2kTqdnSw6IsPGBvZTr6apiejMbzETWFlPluyDuawkQpPF0FFe2atUq7i5Sm8IN7tB3ceKU1gJNKQtWNm4+hWk+8bjb8jhCCbzuDxeqtqqqs+feLR+6sv/+nPGVB1FCeceCLbmrp5/e35bNjSwWsf7ULPBvAPsGF15zF+9CnUNSRp3bqQN99p5pP3XqIvlGTC+EmMGTeG8iIvGwaMRCRTlBWn0FMm7W3NjLLG+KLmSDosggJlKQf4N/H5wuyTDNH7rHryHdNhIafw/wWN/0AIQTKZYtDg6tker+vVO39znef6W36H4juZjmQxR539MLFkjkR7koHjBnD8rIGsWNNGKJYkrTgJdXfwyB1H8sb7Jcyb9zYPPPQhd//2AsaMG8NuToeTgR6N/FScXHE1msXHwP407ne2wsjD2Z4/nrWfLGVAWSe4gR3pt1HT58kB2rMI/r+g8TdCCEzTJJlMMGXylCscTvuDF889nSeefoXCyvMx3YOYNMpCa9MWurar4PNTbu2kKqBywtUHcuWtn5NVfKzcZOG2+xbx4as/IZ6I8uILS3huzHu8/9Eirv7ltdhsVlKGwq+0Efwx3oUvkMNRAlt0P76RQ6ke4WDJ/GpWZY4BKwgMsprnr4puPwbJlUiCCL7XNJDE4wncTq9/5KhR93R2NF100YU/YMHiOmbN/gltvRpDhuYxfXgP85b1c/PP/GgWyc2/i2P3K4wbHSbS1gJFY/BXlrN88XZ+9IvXePHpn7G+rod777sHizaA666/nmwmS6GMER96PMek+5kXeZtHN1sYds09TDx0IJZ1C/ANHEx9yRHQtgPcTtSyQrxucVZ/hiNTqnmp1eBldIgreSAESMn3iZZJZ/Hn5/108gETb/H5vIGzzziNBYuXcdXV88iZ3cy/bwMnz87niWeX09Tl5NZ7hgFJbr4rTDapUzt2ONOmrmDZ8jXYfEPBq/HSc/OYMsbKLdcdz1lndTPjyINQFBUtHmaBoXFRaYqn4wEmPWlhauVJHHfqSB4JQt6mlRwrshAOQdNmZPUI1PIq/A44bBD5IzReetNiL6eM+8p2bUEVGaTi4ftEqx1X+0FBceCo9pZ22lsb+fizlRx6yEUcNqOAOed/DAUupk2o4tX3RzBjRhPzF/ayao3BOadoPPdKPY8+nce7r99MKq2QX1DCH/74DI/P20gy6+DMM4/m2t+8RTKbYTczm6FPsdGqOTnaDZ/mV1BaHuDnawEX/LHuWT4oORgaVqP2tmMMGoWqSzpMwe/c8HpMwYw03Ht16+1vlPfsagoNKMAUGt8nms1u97icLioqyvnt7b+lr6+Ta34+hzseWkAu1so1P7uYQNFg0J9n9pR8DjtYYeqhDpa9W8HW3mIefrgOf8EiakeVEg8v59rrr+Ta639BLNLF1bc/R7S/lykTRrNbMmdwQH4ea03BcwmQo8czscbLeitU3nkVan8P7x9/GdYn7obCwRi+YlLdGc4damerFV5sgPPfvJppyratG5XSG/2K5W4NCZLvDa23L/imz+edsWDBpzz0yB/4wYU/oSuUY9FHr3HaaWdw/WUzqD3iaS46rYSbby1jyfoof7odcFq46Qch5qwfyR1/WA/xT8Hop74pjqNiFH96aD6TI5soyhUyfNIYdnMaKRaGdF7IQms0CV4vb+jw69V/IbjpSW49513QfHhbt9CbUyCV4dgJFsZ54fYOyL//SkoznaRnHGet7Gy/K2mxnN4bTlzrzunzFUUBIfhHpwmDzRs2rOXY4+cATkaMGsr9DzzML6/+EXfdfT4XXvQE8fBabrm2gg0bDSqGObj9kQx9d/XR1euleIAdrzaAjGMqYa2C+57bzEj7Rzw3NcXM8mpGveynemABu/UksnRvWENhbDmJjIX8GcdwTOsbKE9dwksTrqd70kyK//oo1lwKbfsqytrXUVs6igc7IPybWzl60R8YfdNlVNeqlFqmk9memrRp++bPmmRmXl8sdq2eESHDVDClgiJA8I9H6+sLtlZUFuLLqyUaKyWd7Ofqn53B7FnTmDjpMtaugelHjmTO3CBvLjQptdnpTOSBUsqkshz5DoWdylgOK4PjC7ZyxEFhql1JQlkrF6ydQJvoYcowP7uFsiZvr95KuH4twwud1Gx8jEjnEp5qhzUTBkNrFLWr5aHsoFGV7u7WY9UNn4g7HytF2fo5B372Ww67+ATyavy4K3wMrJqIMaaDwW2TaNy87uJg+845G3a1/i4XzDyYX5Cn+4oLBxXlRZuEquJ02dnNNAySySRCCP4jr00lajHYTbJvaYrV1zJgQGWmdtQg24o1m6mdchkHTRrNOT/4HWvX5CgaO4aGXRpLQwGGDcjxxcydvNMEP90xjuGDvBxXHGJTsp2JvhhOzeTzUBEvdVXSnnbwWbuNEQUxqqoK2K0rkqS0aSnl4TrM5j7aC4qYP/uPDFvwZ2ojm1m6bVpnR3Lc5VQPhDylIiNb3Ke3vHzHrvmPn5Q/aigjh5UijF6KtHFkdAOb0wXD7AwZNoHwX1OBgWnr3VeNc19Zv/LFvqdf7xjrdbmW5lKJg/rjaUNRwOW0U1Y+ECklUpp8yaYpRNMGQghUAQb7jma3aTGH09M0qnbg8KVLP+HqnzzFtoQJeiGMmkZvJs4pxToLnQEuK66jZACMTTgoawrxYssw7hy6g6Pym3mzr5LWXB7F9iSH5O/ive5KEt0q0+cMxOkqYLdQWyPmzpVITcV0BKg7/AY4/Ae0yF4mr34u5WirPYSeCIW51Qwf3Nda0tjFyNLSG3onDPGWWhyzbH4nibwAtnAnWbUVW+kEEpGtJPpzvLlyO6WV+cQWfVwu1qwub9sOC7KO6QdPGHGiSzFe7++P0dPho8TMoIocUkr+jRAIKRECVAEG+47mcqiA2FFaVjJcyiLurHZQYEkQIkZbdj25nMqunJfuTD5LEvm880kBm5Jeesw0VxbVY08EeSYxgYI8lZGuLHZp8GFoGI+2VqKZS5l75knsFg+GWFq3jYa0m5rKKtoHTwarBxa/RKijj8Ztne2ujddvc4kk02o9TK6KHPFxq/rsqu3bDihLJw8LxpCLxg2jpHAX3e4kFYdO4I23tvDyGwazy1ZT7uzig08bWPjRam6ZVcyD5+bzwIoQHza3b3M5bIwYOhQRV8mzCqQQSCn4kqIIDEMSAST7lhYK9xOPx+smja45zsTglX4P1wx3sT5VQtypcKqynl2xOC+G8nm5q4gpvhiVnjzuG93D6QWtrNGrGKwmmR+rIp100pgYwOdNWTJL36BiWJoDZ9SyW/361bzXFMQy/WQ6rRZSyTijNz6DJxVGdjeTsqtVA7x6W6lVXWdx+No/XmD5kSWdunVYf7Z5/qG/wql3/rjr4/V3nnTyITuuEdV62TPrK/vrOro7tugTHs/PctAIC8sXryICzFsb4tRZIzlpNITbtpy5wxx4Y3/ORl+ohYryWkxymKbkS4oCyWQGKSX7miYUSKYS60ePHoXmcPLiNo3CohJm+KNUZft4NVbByb5umg/czG9aB1HtsuDPU8g6S9hlN3g9XMsQZ5TrqlazPRbgll1Zzp4cxzO5kNqxowCFntY21u5sYUd3DM1Io+3aQknXNqZUWMmTSVbnJL22Qm14kbXMo9nL1vdoNOZNYcD4iks9g8rnRg+6qjfqJ/Pz/JS2VTrK37x7vsLaRisJ9dc/rF2/sqFp1zl/eb/s3lPOOotA/0Y+XLCF7q4uRtTWMsV5yA1j1IrRtgFlLauXL6xr7dj5mMCQoKDrBrspCrjdblRVZV/T/HklxKKZTdWDaxg3qpLVqxsZpEkGZPu5rWM4kxxhmnQn61PVTK20oUuJiwg3Nh/CCbKMa4q+4OTGs3g8OIl4TDCkahuP/uZgLJ4adotF4/QFg6xs6oEVCyn09FCu6WTs0GDYCVadRK+vj5pNHxA13CwrP5K+mqFQW8v2/JIi3AWwva5y6qQR+MscvPtum2fegfXEjz6Epp7MD8498JR31j//5/suvelZ+9yDbrj1gPOu1o595ll2vvoMlu4FPLNjBlMmTD+xIuKgP5QNL1ryxaMIK0hwOq1YLColxaV43B4UIdjXtEg0QVd3cGt1zcDYWSfP9Kxe/RA/XzIR98CxPD28Dj3aw7ZMgBV9Nrbn8nhk1AbqMlWc5FrHK01TaS88jRJHljbpREmlmViZw+Kp4UtdnV2EMybNqz5joL6LMruFjFRIaB42Vp4FIw5l7Ds3YSsuYcXkC8kEymFAEQgVUnHo64bSMZw1SOGjeoO7izZx/pTDgCH8zYmgNE26sfrOt9evvePii3876o+9PWcfcuh4POI0dvUYjIhL1ix/kt6KCTg84hGHBYSZZfioKgIlAXq64rhcAaxWDUNKLOxbmk3LYSg5IxaJv37ehedd8Ivr78Upl1MS38Xa6EA+ilQwVHTSa+gMUjpZ3esh57AyzRVketFidskStiRctJFPSZ6HBx9ZzrTxXg4/8lhisTjprMmG5Z/TvmQ+3iIvPbYC2h1FpN2D8DgtHPnxxbitCV4/71kyBUMg2ARCA1QwcmDLY9TQEoISot3bOH9cAsgDTEABQlWQffT2629eMfOTy686+uePOycWaSc99uhVHHPcz1kb3Egk8Tz19XVcdcWP55533ljOPecX17kcApfLjmnG0XUd05QI9j0NKXDYnNRvrps3fvKEC95686/UDi/i9gde4bdvq4wfN5jFHUnmFrYyypEio3jQlCiL+/OoIcdUxxJ2pUYTShZhmln6djXSH06yWzDYR2fzdh57+lm2Oapg8AywuyDezeDuZUxtaUYOreHtw+8h6iyHnmZABUXDY9GIZU2QDo4q97G5A85VN4K/EggAViAEWJFmL2OGDjrnrt9fes2PL71tzpKeXM3br3/+cG9H6eE7OsopCBRQFNiByIqSM874+a8CebXy5lvPvX5z3WZsWjGKorC/0Ha2NCGAvr7+xW6ft+eEE48r4m/OPGEXT73wDK3xifx6YDelxPhT10B+VtFJNQnuCg3n2V4fLmUIFoeDCl+OT15/nR//ZAqnnXEayWSa3l1NvPXJZ6zr98K0g8AiCXSsY0jjEmwSVh99IdumzgUsEOsG1QZCYZzXTkwRxHoTTJ1QiO5Xic5fylk1bcAMwAqEgCzgw8gqNDVu0i485wCWfHEEf33pkx13vLLhiDN7Lddv6wnYIqlsxQ9OHXxha8tfuGzuTu5/cO51XyxYc+Jvbr/zp/Mef2Z+LJahsLAAIQT7muZwOBBAIAAtrS03DBs+5HFN01i6YitGJEKx6OWVYAE9WT9bIgFmBaLk27MEDRd+m4EwMuQ7XaxcXceQwT386b5b2K2jtY2O5kZeqWuDikG4Io1UhBvJi7dhWFRWTDyT9PRLQFMg1guaHQwYV+xlqs/BI/VtFAScHHXwCJ5fH+OythdRZx4KSKAXmQuhp01QgkgjTldX5ODOpvaKa388p1WRGZ5+eSFvLdt0h83lp627l9/+oariwEkzD2/reYOjT36R39x8y8i55172mWG4nm9uarljx47tdbF4guLCQnSdfUabNvUAdhNC0BvsndfXGz6nuKTgkMqBA4DN9HY0kykuJmH0U5MvebyxmPebkkTMDiqGVmKxWmlt6SPS/CELl1+Las2nvb2LaHsLL6zaQjAMtjyDoTuWYcnGUBQ7DdUHkx46DRQd0hkwJWiCGRV+AqqC32nnxEGFlIwbyxtbDMpeupohIxJ8sbmLofFllNWMQWh+FK0LU09gtWpE+vQJPe3NL+dGdE67/toD6Yt08dknu8gvDCBzbfSHtx45fNiPG46cfUbNH+fdG77sil9sKC0tPHjw0PFnH3f8iWfrmfStD/7hwV+3trZSUBBACMG+oC344nP+hRBIadLVFTr8pFPParrgoh9UpDIZLr3sLrL6eQwaVE003IknkGLctEEMCfXw+sc7Ka88mMY1H/Lsk2dSO34aoVA/rVvrWVG3hZfXd4DPzeDwOhyagpHMEQyUECmoBqcDVA1FZihyuZgQcJKTkrd39bI6muKOGRN5OGSj/oYzuGXAdgLDzqOrs52NkRCappJXWIZqDaBZC6jfvILGHU3UVPqajWyOWFRyxcVHsnn9i7R29CBUG9LImH984prpc46au3rGxIMHbtgq7luzbvF1XcHYO+FwOHDBOWffcs9d95784ovPXfXhxx/OVxQV14AB/G/TfnDxuewmgGRKpzBfMartaymf+yd+fOlleN12zjn/DmKRo6geWs5Dtx/OjGmj0Oxe6qfNZfXSs3nwD/M459wzMQyTHVsaCEaS3D5/C+gJqvuW4u9rJuX001s+hdbCavAXQEkFuzlUleE+B1MCHl5t6QPTpCOtMPeLbsoWPMC05tcJjjwJVdE45pAppBQX4b4eQsntZLKbicQStLb0MWlcJQFPQUmqXyDCMGpAHnde4+eSXz+HNLrYLZ3OBt/79Lmxh047+p5IuDMaCSeWaequ4UKxPPTQI4+efuLxx4/5wUU//Kx68OB5L7z04rXt7W2hktJSFEUFDP43aNFolt0UAYYJ5x41/Jc717xXcepSD6/+5V7OPu8iSkpLOOyIs2jbPo6ZM6/irbfe56STT+apx2/h1VcGccVPz2W3hvoGNKuddz79iN5lH1JlDTMg2UcYjZ0DJpKsHAvJMJRUQEEJoj9ESsDCSJIvuiJcPHwAg/x5vLNdp2DDHxlb/1eipUNQVYWOnjB5PjelxeCzW0klDWQa3IqNyaOGEAqnaGjenlHMfhRVpSMKU6eVc8Pltfzqzp18yZCEO7t3Xhzs3UnOMBBC7W3ZtfOMSKTvhVB/6PeTJk4ceuzs2RePrx0355XXX716yfKlT2X1HD5fHkIIvmtaaZGX3WJJneJivzh3Vvl1v/9sBNsaFnH3TT/m57f8iVmHH8P6dZ+yfNkquoNhGnc2s33bNkaNrmXU6HvYbeP6TURTBn1Nmx/u+vjRmjFh/QjdbSHi9LOz4gCSFWMQ8V5koBiGjAXTQJgmSDBTOdwWhSK3l40tObxL72FW8G3SeQX4HC7yfG5MwyAWT6HQRy6nk8noZPUcmqbR299De2eUnEx87nKlkShIJA0tOznqsEoefz7Azl197GbRLFitTiwWOxDFYrEgVEEyEXtzx45tb4XD/bd1dbbdcNjBhwbmXjD3ycmTJp71wqtv/KyhYWt9UVEJPq+H75IWiaYQAuJJnUtPGfNDn0P164qFqUN93PL7R192+Ie+dPo55782dtxkxo6bTCwW57DZh1FeXs6X1q2tJ5sJEnAmF27O9FzWP2jSgdlC6xE5q5dGxUk2rwAlFQJFgRGTwOWFeAwhFIysgduqcvPYQby0I0zzew9xcv97RG1e6hLe7JCigu7KIm9Fns+JMDNomh273YXTBYZhkk5nsGgKgwba2daadgajChZVYzdTSuzuAGecehB33PsGX0VKiRAKToeTjG7I3p7uG5f3dz/f0lh/z7RpBx8967AjZt9y3bV1b3/w6W2fL1hwc2dXBx6XG1W18F3QTFOg5wx8+QHOP6L8lhffX0+st4p8b4K0zs2r1m9uGDdl56QNGzY+M2HC2JGBggDjxo3lS0sXLSOrx9i2M1E3snLyIUv6AixW4ssx6hIDiwe4fAoE43E0PY2oHoNeWIGIxxGGSS5rgKZy04QqPtvay5pXHmZm36csVfzscte0ZUpHHFEoNza1N2xcoJjZAyyDB1Joc+D1+TANk67ODhACze2hvb8DPSuW2qx5CAS7qUAoJJk5ZTKlxQvo7A6xJ1JKNE3DbrORjIfrG3fuOCbS13t2867me2YddkTpyccfcdP0qVNOefOdD362eOGnH9scdhwOF6Zh8G3SXC4rff1Jzjt+2PGGTRvwSNuhFAYCdK156mUJDR3tLbiczjVb6reM7mhv//P48eN+PGzYUEL9/axetZp0NoNL27nxlSfHTvt0Wblk2quI8r6c3LFzfUSJzQhUj6I3k6amKEBL9WgMRcVMpTGiafLzXNwypZoVrTk+evctlG0LWOQqgIJJrzLskAttel08f91KlmzPvDyio/OARGs5zet9uDxurE4X6XSGWCJNpquvyV1pP9pXM6XBYbrJmVm+pGkaXo8Tn99LZ3eI/4qUEqfDgWER9EeTzy9fuujtXS3tt0+bNvXKg2ZMHnnRRed8NH7C+KdeffH5X2zfuS1UVFyMqigYpsm3QXPYNbxeN4ePsV7wfr1Kc/4JVGVeMTe0BC/hbxqbGunvDxEIBKSmykuXLVv+9rq1638fjUTG2J0O+qOhtXpszTS/cnwW+lGGR7E4pqM7GzZEGjfN8FUMZYRDEBhay468YnLhGOQMThlaypFVhTxXH2fBJ59Dw4eYgUIomXEFvkl/RHMxom0JZdkQ/e7isEVTiHW109u4HbfbjtNpR9dNemIZZCT6RmmqsCGekiimgpQmX1IVBZ/bikxF2U0I/ktSShQh8LjdxFPpeOPObVeF+sMvNDU13z9z5gHTJs2YNXfUqNoTn/rLY9d88MF785xOG/78AEII/qc0QwpGDCm0W23Wo5TmRq4qeJpPP114biSrRCwWCEd6CfYGcTm9aKqJz+/7YGvD9g/sVsvtsUR8csPOhmNGD7YZNruEkTtQ7R6MtB1RNnkR2xdcFu7qYs7JJ9A8cBTZljCzC13MqvCTM+1c9V4zMtvK74at5w/b7R93VB39c6w1dcTc0LeNio5t9OInm1EW9UVSuAtcDCgvRUpJPJnB63ZRZHNRJ+wLOoIGtGxACsnfK/bZyPda2U1KvjYpJTabDc1iJZVOrVi5auX0jrbWn3R09vx+1uxj/LfedtvjRx955Jm//d1vr9rasHVzeVkZmmblf0Jz222MHOicnEjrrgHuHMs+/uDpjQ2pF6w2C9I0icUSBIM9FAwvIptJoAiB3WZD09QbWzt3AQJrzo9W0giuECKrIWQvoqxigZEXIKpLPnXWcqLPzuGTPPSns7xW18+qje3MLOvmd9OiFNsHkdWN9avaNtXFtRaCjiEYHUuwayGSLh9S6ttTWXbG42q1pdiHrutEYymsDhuqIozBidRCVVERVjtfxZ5TOa3Cy8b6bhLZHP8dUkp2c7tdpNNpmnY1P9T7avC17dsbfn/0UUeff9qc0w479tijN915192333//vTcJRTC0ZihCCL4Jrb27n54ebWx/v5u3l/Stendtai5/k83ofKmvL4TNaiWbSbCbEAJFCGw2GyQUlKhCbmQc9ACYeSAkwlfcqeyYsdXctmJ43bYdRI1ifC47m9f1IPR2bh0b4rRhEDOsNOYc1FQGrtG62h50i1iH09tHc38Xy5N21JxEmmB41M+9Hnt1LpPCbrVQkO9GkYL+RGqDrmbCVk2wJykTCgNWhg70sa5JRxGQzUl2UwSYkv+SlBJNVfH7/SSSqa6Vq9Ze0NHW8dyyJYvvu+TiS0bdd9/vbzz9tFNPvvynV/5szZplH1dX11BYWMh/l+ZwecnL8x736eq+7LuLmg/iK4TDYYSi8FVsAvpNg7VZFyJjQ5hZEBJhtaJWTFhqLnx5uG3LR7QGLqV1x07m5LcytybGoAI7nbobKUATJg6Xn4pRlVfm0rFrHXY7Q0q8bOnuJhqKomgqhpDv+jyOizVVYlNh+KAi2rpiNHTE10TtGgqCvYlaNMpKrGxqy5AyHKiKRsBrwTAFCL42KSUupxNFVYjGEx8vWLxs9PoNm2447rgTbr/uhptGrl699KP7H3jw6Qcf+MMv6rfU91WUV6CpFr4uLd9tYdP28C0tXbEfA2m+gmEY7IlfT7DJNoj6snEoqRQGBruZLi/ScthnLBt+UWbJu4wYUs51k+yU0Ydu89OadWG3CCyagiIU3C4bRnH5j6KJXddnLNKwW91UBPIJxjP0CB3d1KfZ7RbyvDZsikBTBUKFbCqrm5EsQhXsTTqZxUilsVtSxGJNzJ2h0h/x8+Im8Lv5b5FSIoTA5/URiUbo7A7+9ulnn315ybKVv//VtTfM+dlVV15w0YUXnHjLLbdeN+/xJx5xe1wUBAIIIfivaEbOoCuaWWGYkj1RFIWvIpAoepp1FVNhQgVmP5j8XzYQ2bJ3xLQzH5KrFqycatRvGecZtnJTzIctp+K2mQgUhFBQVQWr1YLbcPmk4Z/rLXA+sauhmWVLN2K1uZAu+6NO07jEpUlGVBdjUQTh/ihk07S2xSLBvjSqprA3NhWSpsQqwSl3MmJAISuiVnKmyTdlShOLxUJeXh7JdGr71oa6k3/2i6tOX7xw1V1XXvXTygceuP/hk4499bRfXHvlLzbXb1hfWFCM2+1hbzT+xm5TyZkm/30SXWgkPT6wA3b+nQWkQoy8QZeLYUEOmzKeXjP1TDbdeb5Vy0dKiZQSaZqYAhRVRVVN3M7yH5UEKp/ocTpwDRmDzIRn+0hcUuRzs3ZzK4mkjtdlI9gbYd32YKozGH/AogiMnMGemFLiEhbyhIrB3wg70ZRAN0wUwf+YlBKX0wVCkEhGXn7y2T+/9elnH//mjDNPv+biCy+e9cYLn6y7+8Hb7vzrC09enzM6qSivQAgBSP6exv+QACy5LOSAHP9OAXQJPR3UluYzc+YhpDLpS1MNnx8T6gsWqJqCZtGQUiKlRErQLBYUYUxubWouCIX6e2snjaV328YHc939lBcW4bEq1G1tx8zliGSgJ55tHVTr6hGaYG8kkG/X6GnIonfynZBSoigKfn+AZCKR2dG06dp77t/x8tvvv3HXDy740awrLr32ujFjJsx5450Xrq6v2/ye1WojP+DHwOA/0viumZICl5X+3naiWSUpbIUzPd7EFtMw0LM6mt2KNE30XBZNU7DaHSQSHQdH+re9tmPzdkE8PtiaNSGXY9SoSqaOLqNlVzcbdvTi8Dsq8pBFXil62AuhgNvQWG6EMATfKdM0sdsd5PtV0tnUmvrN6w/79e2/uvigmbPuOubIE4ZffOFl727ctPbpDz5450dd3Z2ZgK8AIfg3Gt81h5Px/iSZtnp6EiZ2m3ur31fykCHjP8lmJbpuoGMihMRqtWPoCjZL9sjpM8pee3/+GhnuS1w/xG27JxlPEI8lKckvpKKqlLgObT1hR19z4g9rtoXPdNs19saiqbQLHZed75yUkt1cLjcWTSUejc378MN33qjbsvHOaVMO/OHRRx9zwQFTDpj1+Lw/H7du7dqNTi0PqxDspvFdkoBdI9UbZl19ij5dEEu2MbjUd/nEiQXWoJH6oTQMhCLQNCuqasGqCcL97nNySuqXlQOLIm1tO+/Nr62pbu9ovrSvL4LbpoKewaPkyNMEtmrPGUsy0ec/bI2+bVNASr6aDk4ryByYWRCC75yUEkVR8Xi9ZLOZvl2NjZf0dgdf3L6j4dajjzr2wFmHHbshHcudvmXzllcsVjtCCDS+SwLQTSISMppGxhRkNImugN9ZdInU4r5Uuv90q9WDaZjY7VY8bhtOR5nz7bcaP8i3B24YXBn9vDGWuazEV7B6286uJ2rK/WRNE5tFoWqADzNncql38FuPxrdWZ6TeaFEEX0VKiaKAdCg48hRyOQmS/xVSSmw2O1aLBT2jz1+5ctn8+vq6o8eMHX/NwME1L2dTymO9we4f6TkdjW+b5F8JIJ7D7YbrzqjCG/CQyEr+lURoSQIOcb3pLzrdYnVi0QSappHNZsmkFEaPqZ6WTEbnNzVaLwutbXt48NFj/tIXMmqzGf3KwoCXvr4oigDDNEFonDip8qPFbd1DVEUAgq8kQdME3QmDWMxAUTX+t0gp2c3hcKJoKul06oP1a1Z90NS0/aDSospby6oqHks1R+7T+Ja5FYM4KhhAROHHR0xm5LgKErpCPiCEwDQlWT0HKDt1vesOcq3X2+1udjN1SX4gD5vDRmewg3HV5X/2/+b5lzevbe9rPvKAm1b11l15flWAdDpDLJbCMCV5fjsjlEBNRzgzN5UzntIUwd7481QK7WkadQNQ+d8kpUQIgcvlRFEtxCKRhYnoxkOdPv8hQlPzNL5NBuQ5TJ52riGSypCuUjmmQBLqbseU/CcCMHMGuhHbpXms6IaCy+PDE3AgZIzODVs5afYssvEwTx4/bsE9Ly0ed+zri2Iev3yufqD3nCEFbhJJHYddwe/WsNksHDi04Jpkf99TdqsKSPZI0XBaDD5t1UFK9gUpQQiBzWZHFQqRcOQLq0VD41sWMiyc4OxFs3eD5iaVsxCJmwj+XwKpZBO9t7sLh+MrHAHYgCxgUGpX2fzhW5TXTuSEuSeMalPdC0oXbjtk9MH5V3ze0HVOzm9DsViwW6yAwGNVyfM6RzTHQsMUYTYoSPZEQceuaUgBCjr7A4vFgqIINL5NAhRTp83spUxLEzElKKDZ+QoSTbMopmlzN61fS2VtBpfLj0yGie7YTPvqxTSuWkl3NMXpP7mKa8/OTW+dpFo7K0eFupb2nvXO8tdfOH1IPi67GykEqmKQyUpkUAzWVNmgSMHe2JwCshqoWfYnGt8yoeTojmTRswYJ1WBvcnoyF3C51pX4XdPVZIz+YJiFTz2MPdGJ1eOloGIwTz/zJsE+k8CQ4p8uicUSEz74gJ+0qi9uUu01S0OZ247w6/i8XiIpQV2wq3Vppn2hxQJC8pUkoNrBq6v0ZwqwCoX9ica3SYBQNaIRO2ZfgqRVsjd6DhK28LMVJfbpRihGfukAsqqNru4YSsLCmi1N2FWV6LYlrFlplu3o1jGzKS5sijGusvj2K2Yf1Pjy2vrrhxUm8tqDcnWfrevyUYdkE2aWryRM0D2gZyC91gumBmTZn2h8y4QAKbNoqopFswKSPVFVMEzt9awu/my3Kzi8TsbMOpLfvLUACFPkd3HMrOEUF/vJbw7/Ks/edntrQUHiMUXnYofKiGL/8y+FtOc3bW1WfXarMXCMQsAFugZI/hPVgP4AVMUsBNYpfJIBzSKR7F80vm2mgWZxojiy5EQMRWjsiUSQzWa7EymxpbK0bASGjqOgCKfHy7ABTmZMrCbf7yaeyOLz2cnZ7ef7ulIPLy7Po7CwCE8yi9sisLvthseiIUij65DLAZJ/JyHhg8J2OPXVAtYXpMmWZJCS/Y7Gt05BVez0p9bQkW3EonrZKyVLKFQ0JxGVl0cy69WlX8y/dNqkgdQODOB0O4kl0yQSSfKdGtV5gUu29fY8bLUIPjaSlLV2olmsaIK9ElaImFamv+eifIfksxEmQgr2RxrfASklqiKwWFU0obA3ms1CNJZtWBuO/3TykpVMn79+zZYTaud1hNPUuBxYNIV0KoPLaceXbx1XGrBV2CxaK4aBbGxFVZ0EpUKFAMH/SyhgAP11+aSiVshLoJiAwn5J4zujgFRBqOyNNCWqoqF5XZT1x5jUkn6ie2Pn8J1jS64uiqcpzHPi8bgQSKzSwO21/aIky1WqpqEiKdSyNCgaPUnQFQXVAaYCSBCANMDUIZcTYM9BWLA/09gPCCEYKeH8WIpFGLCw+ZczTErHzvaco0kTj8tGfziOTZG47LbLMqnW21Ul2ytzAq8qmFQB9TmFuNXA7NEQBn8jkAbItEQU5lA0CQj2dxr7AwHBpMEJ8SzjLWAxwLei+dxgkaOme1jxAdUOFU0VFLis+O3S8nizfnkwmfy1S9UwpURRBG4BolvQknGD4F8YGYX86hTlVTkE/xg09gOGqpINxji2xo27bBiKaiGTM9mcE7M7upNdbT7NMdBnIdIfo64pRLrbeqrT4bq9fHxHzuI0MHP8K8l/JsHhAVUBIUBK9nsa+5yJ1eoj3tPKIr0V4bYBOrspOSPq1sWPvLaiZxpbulhZHyQYzTJ6QN4of3nJhpAnNF51JbMyy1cTYBjQ0y7IGiaqqrK/09iX7Aqq24XsidHQ+zlRZwyLXedLErCL5F+NtV3nhzrk4TaboMCtMXKwj5ph5SNfWZp+uTHSeZLFqoBkz1RB1mUFNc3+TmMfkQKUoIkMadDTTaXSi+axAyZfEgJymkR3eI+oGuIPhzNBX1WBm1GDCxFmlIF+x4n27vyJWG1rdKvCHkkIaRbS9jZMdPZnGvuA1ARqTqAvayIWSWLVFEoYCnHB35MmCJ9Eq/Asclnzj1OiYfr7oghFUJkv0Ac5Hx2/eNekgCmR7FnSqlLQl0AxXJiKwf5KY18QAilURC6BJRMi69DIobAnhpTQEb1RG15znCttIxmJM6DYi1dTSdstE9npe7BiS/hKp2JFSslXUU1JwhGgq8CFK9mGcEv2Rxr7iKmAoii402m0iAVLzkTy1QSQMeMbkrpyj6guvdrjzGDTQLNp1Jiw4djqK3aVt64pSHQ/oykgJV9JihzuXIyMSJKTTgSC/Y3GPiIkJJ1QHjfJa5IkNQXNNPkqgt1UYjt6ftkptZMdg92DnW4n2Zwkm5MMMnW2eKxPPxmMLzEwdwrJVxIS0CQZUyMgbKiayf5GYx9SpEBLmXSXOmkd5sOeNNgziTDAVLk+mxMvJjMGFpsNp1NiJNIMLvAxpHvIC439vVNcDgUp+UpSQkAV5HtzNPXlQLJf0djHlJyJcKpEKpwkMiZCSvZICPRE7iUznpnnRrhLSmwIReB02cjzKkwdmT+5bXFobDSY3aBqKnuSBjIRyCQEmkWwP9HYx6SqkFUFtUvbye9Os5uQfDUhMSR0VPr/3DLeeY0nksDmcWARKgX5HqRQ8fgKT0q5rRtsmmRv3C4rHrWfXE8QrBr7C439QMamULUjydiNfXwdwa2RX6+qKTxfH+wtcaezDCjJx1HoZdW6FnKiuHjoiIGITJq9KSl0EkyuJJ1J4/Y42V9o7AeEhLRd5esqTOup4uWdU7dWFn8wQTFH7NrVzpaFdWzJOjjuQvFwUSCIntXZm/w8SX2LGz0rQbLf0PgHZeaMXU2rmkeGvZ7bTKmd3xOtbTzoDPPaI058aRNfi4btmdEgHexPtB0tXfxP3c1/ZAXmAHP4L53CNzYZmMy/uAm4iX/zIl/XAw/BAw+xX9H4p/2Kxj/tVzT+ab+i8U/7FY1/2q/8Hw9KU5HHQr7sAAAAAElFTkSuQmCC";

window.addEventListener('load', (event) => {
    console.log('page has loaded');
    ctx.drawImage(png, 0, 0);
    drawPixelImage();
});