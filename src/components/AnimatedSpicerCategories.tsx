import React from 'react';
import { Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

// Глобальные (локально подключаемые) стили, необходимые для анимации категорий
// Вынесены из SpicerCollection и теперь используются брендовою сторінкою
const CategoriesGlobalStyle = createGlobalStyle`
  #SECTION_1 { 
    block-size:433.875px; 
    height:433.875px; 
    inline-size:85%; 
    width:85%; 
    max-width:1600px; 
    padding-block-start:110.425px; 
    perspective-origin:50% 272.141px; 
    transform-origin:50% 272.148px; 
    font:10.5125px Mulish, sans-serif; 
    padding:110.425px 0 0; 
    margin:0 auto; 
    background:#fff; 
  }
  #DIV_2 { 
    block-size:433.875px; 
    height:433.875px; 
    inline-size:100%; 
    max-inline-size:100%; 
    max-width:100%; 
    perspective-origin:50% 216.938px; 
    transform-origin:50% 216.938px; 
    width:100%; 
    font:10.5125px Mulish, sans-serif; 
    margin:0 auto; 
  }
  #UL_3 { 
    block-size:433.875px; 
    box-sizing:border-box; 
    display:flex; 
    height:433.875px; 
    inline-size:100%; 
    margin-block-end:0; 
    margin-block-start:0; 
    padding-inline-start:0; 
    perspective-origin:50% 216.938px; 
    transform-origin:50% 216.938px; 
    width:100%; 
    flex-flow:row nowrap; 
    font:10.5125px Mulish, sans-serif; 
    list-style:none; 
    margin:0; 
    padding:0; 
    justify-content:center; 
  }
  #LI_4, #LI_8, #LI_12, #LI_16, #LI_20 { block-size:433.875px; bottom:0; height:433.875px; inline-size:188.656px; inset:0; margin-inline-end:33.5692px; perspective-origin:94.3281px 216.938px; position:relative; transform-origin:94.3281px 216.938px; width:188.656px; font:10.5125px Mulish, sans-serif; list-style:none; margin:0 33.5692px 0 0; }
  #A_5, #A_9, #A_13, #A_17, #A_21 { position:absolute; inset:0; display:block; text-decoration:none; z-index:3; }
  #H3_7, #H3_11, #H3_15, #H3_19 { width:188.656px; position:absolute; left:50%; top:50%; transform:translate(-50%, -50%); opacity:0; font:900 23.6625px/29.5813px Mulish, sans-serif; letter-spacing:0.591563px; text-align:center; text-transform:uppercase; color:#000; margin:0; transition:opacity 0.3s ease, transform 0.6s cubic-bezier(0.4,0,0.2,1), bottom 0.6s cubic-bezier(0.4,0,0.2,1); z-index:4; }
  #LI_4:hover #DIV_6, #LI_8:hover #DIV_10, #LI_12:hover #DIV_14 { clip-path:polygon(0 0,100% 0,100% 100%,0 100%); }
  #LI_16:hover #DIV_18 { clip-path:circle(71% at 50% 50%); }
  #UL_3 li:hover > h3 { opacity:1; bottom:40px; top:auto; transform:translateX(-50%); }
  #DIV_6 { clip-path:polygon(50% 30%, 50% 30%, 0% 70%, 100% 70%); transition:clip-path .5s ease-in-out; background:url('https://spicer.ua/wp-content/uploads/2025/03/xaaaa-scaled-_1_.webp.pagespeed.ic.gBzUJPDoPi.webp') center/cover no-repeat; height:100%; }
  #DIV_10 { clip-path:polygon(0% 30%, 100% 30%, 100% 70%, 0% 70%); transition:clip-path .5s ease-in-out; background:url('https://spicer.ua/wp-content/uploads/2024/02/xtom-yam_nova-etyketka4-scaled.jpg.pagespeed.ic.jDI4z6GSXa.webp') center/cover no-repeat; height:100%; }
  #DIV_14 { clip-path:polygon(86% 30%, 100% 37%, 14% 70%, 0% 63%); transition:clip-path .5s ease-in-out; background:url('https://spicer.ua/wp-content/uploads/2025/03/o-de-v%D1%8B2-_1_.webp') center/cover no-repeat; height:100%; }
  #DIV_18 { clip-path:circle(25.3% at 50% 50%); transition:clip-path .9s ease-in-out; background:url('https://spicer.ua/wp-content/uploads/2024/10/x4-4630-scaled.jpg.pagespeed.ic.7HdXLWoA9R.webp') center/cover no-repeat; height:100%; }
  .stripes-card { width:188.656px; height:433.875px; position:relative; overflow:hidden; margin-right:33.5692px; list-style:none; }
  .stripes-card a { display:block; width:100%; height:100%; position:relative; text-decoration:none; }
  .stripe { position:absolute; inset:0; background-size:cover; background-position:center; transition:clip-path .6s cubic-bezier(0.4,0,0.2,1); }
  .stripe--top { clip-path: inset(30% 0 60% 0); }
  .stripe--middle { clip-path: inset(45% 0 45% 0); }
  .stripe--bottom { clip-path: inset(60% 0 30% 0); }
  .stripes-card:hover .stripe { clip-path: inset(0 0 0 0); }
  .stripes-card h3 { z-index:10; position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); opacity:0; font:900 23.6625px/29.5813px Mulish,sans-serif; letter-spacing:.591563px; text-align:center; text-transform:uppercase; color:#000; margin:0; transition:opacity .3s ease, transform .6s cubic-bezier(0.4,0,0.2,1), bottom .6s cubic-bezier(0.4,0,0.2,1); }
  .stripes-card:hover h3 { opacity:1; bottom:40px; top:auto; transform:translateX(-50%); }
  @media (max-width: 768px) {
    #SECTION_1 { 
      height:auto; 
      padding:60px 0; 
      block-size:auto; 
      overflow-x:scroll; 
      overflow-y:hidden; 
      -webkit-overflow-scrolling:touch; 
      width:100%; 
      inline-size:100%; 
    }
    #DIV_2 { 
      width:auto; 
      max-width:none; 
      height:433.875px; 
      inline-size:auto; 
      margin:0; 
      padding:0 20px; 
      min-width:100%; 
    }
    #UL_3 { 
      flex-flow:row nowrap; 
      width:auto; 
      height:433.875px; 
      justify-content:flex-start; 
      inline-size:auto; 
      block-size:433.875px; 
      gap:0; 
    }
    #LI_4, #LI_8, #LI_12, #LI_16, #LI_20 { flex-shrink:0; }
  }
`;

// Обёртка чтобы можно было позиционировать в странице бренда
const Wrapper = styled.div`
  width:100%;
  background:#fff;
`;

const AnimatedSpicerCategories: React.FC = () => {
  return (
    <Wrapper>
      <CategoriesGlobalStyle />
      <section id="SECTION_1">
        <div id="DIV_2">
          <ul id="UL_3">
            <li id="LI_4">
              <Link id="A_5" to="/spicer-products" />
              <div id="DIV_6" />
              <h3 id="H3_7">ДЖИН</h3>
            </li>
            <li id="LI_8">
              <Link id="A_9" to="/spicer-products" />
              <div id="DIV_10" />
              <h3 id="H3_11">НАСТОЯНКИ</h3>
            </li>
            <li id="LI_12">
              <Link id="A_13" to="/spicer-products" />
              <div id="DIV_14" />
              <h3 id="H3_15">DISTILL</h3>
            </li>
            <li id="LI_16">
              <Link id="A_17" to="/spicer-products" />
              <div id="DIV_18" />
              <h3 id="H3_19">ЛІКЕРИ</h3>
            </li>
            <li className="stripes-card">
              <Link to="/spicer-products">
                <div className="stripe stripe--top" style={{ backgroundImage: 'url(https://spicer.ua/wp-content/uploads/2024/02/oooo99-scaled.jpg)' }} />
                <div className="stripe stripe--middle" style={{ backgroundImage: 'url(https://spicer.ua/wp-content/uploads/2024/02/oooo99-scaled.jpg)' }} />
                <div className="stripe stripe--bottom" style={{ backgroundImage: 'url(https://spicer.ua/wp-content/uploads/2024/02/oooo99-scaled.jpg)' }} />
                <h3>СПАЙСЕРИ</h3>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </Wrapper>
  );
};

export default AnimatedSpicerCategories;
