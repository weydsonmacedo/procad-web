import styled from "styled-components";

export const Container = styled.ul`
    margin-top: 20px;

    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #444;

        & + li {
            margin-top: 15px;        
        }
    }
`;

export const FileInfo = styled.div`
    display: flex;
    align-items: center;

    div {
        display: flex;
        flex-direction: column;

        span {
            font-size: 12px;
            color: #999;
            margin-top: 5px;

            button {
                border: 0;
                padding: 0;
                background: transparent;
                color: #ee151f;
                margin-left: 5px;
                cursor: pointer;
            }    
            
            a {
                margin-left: 5px;
                color: #086972;
                font-size: 14px;
            }
        }
    }
`;

export const Preview = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 5px;
    background-image: url(${props => props.src});
    backgroud-size: cover;
    background-position: 50% 50%;
    margin-right: 10px;
`;