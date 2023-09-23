import React, { Component } from 'react';

class MovableImage extends Component {
    state = {
        dragging: false,
        initialX: this.props.origin[0],
        initialY: this.props.origin[1],
        offsetX: 0,
        offsetY: 0,
    };

    handleMouseDown = (e) => {
        e.preventDefault();
        const { left, top } = this.image.getBoundingClientRect();
        this.setState({
            dragging: true,
            initialX: e.clientX,
            initialY: e.clientY,
            offsetX: e.clientX - left,
            offsetY: e.clientY - top,
        });
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);
    };

    handleMouseMove = (e) => {
        if (this.state.dragging) {
            const { offsetX, offsetY } = this.state;
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            this.image.style.left = `${x}px`;
            this.image.style.top = `${y}px`;
        }
    };

    handleMouseUp = () => {
        this.setState({ dragging: false });
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
    };

    render() {
        return (
            <img
                ref={(img) => (this.image = img)}
                src={this.props.src}
                alt={this.props.alt}
                style={{
                    position: 'absolute', left: this.props.origin[0], top: this.props.origin[1], cursor: 'move',
                    width: this.props.width, height: this.props.height, objectFit: 'contain',
                    transform: `rotate(${this.props.rotation}deg)`,
                }}
                onMouseDown={this.handleMouseDown}
            />
        );
    }
}

export default MovableImage;